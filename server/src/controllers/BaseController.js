const mongoose = require('mongoose');
const { success, paginated, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');
const { slugify } = require('../utils/helpers');

class BaseController {
  constructor(Model, config = {}) {
    this.Model = Model;
    this.searchFields = config.searchFields || [];
    this.defaultSort = config.defaultSort || { createdAt: -1 };
    this.auditAction = config.auditAction || this.Model.modelName;
    this.slugField = config.slugField || null;
    this.populate = config.populate || [];
    this.onCreate = config.onCreate || null;
  }

  list = async (req, res, next) => {
    try {
      let { page = 1, limit = 20, sort, order, search, status, ...filters } = req.query;
      page = parseInt(page);
      limit = Math.min(parseInt(limit) || 20, 100);
      const skip = (page - 1) * limit;

      let query = {};

      if (status) {
        query.status = status;
      }

      if (search && this.searchFields.length > 0) {
        const orConditions = this.searchFields.map(f => ({
          [f]: { $regex: search, $options: 'i' },
        }));
        query.$or = orConditions;
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value && !['page', 'limit', 'sort', 'order', 'search', 'status'].includes(key)) {
          query[key] = value;
        }
      });

      const sortField = sort || 'createdAt';
      const sortDir = order === 'asc' ? 1 : -1;

      const [data, total] = await Promise.all([
        this.Model.find(query)
          .sort({ [sortField]: sortDir })
          .skip(skip)
          .limit(limit)
          .populate(this.populate),
        this.Model.countDocuments(query),
      ]);

      if (data.length === 0) {
        return paginated(res, [], total, page, limit, 'No records found');
      }

      return paginated(res, data, total, page, limit);
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const { id } = req.params;
      let doc;
      if (this.slugField && !mongoose.Types.ObjectId.isValid(id)) {
        doc = await this.Model.findOne({ slug: id }).populate(this.populate);
      } else {
        doc = await this.Model.findById(id).populate(this.populate);
      }

      if (!doc) {
        return error(res, 'Record not found', 404);
      }

      return success(res, doc);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = { ...req.body };
      if (this.slugField && data[this.slugField] && !data.slug) {
        data.slug = slugify(data[this.slugField]);
      }

      const doc = await this.Model.create(data);

      await logAudit(req.user?.id, `${this.auditAction}_created`, this.Model.modelName, doc._id, `${this.auditAction} created`, req);

      if (this.onCreate) {
        try {
          await this.onCreate(doc, req);
        } catch (err) {
          console.error(`onCreate hook failed for ${this.Model.modelName}:`, err.message);
        }
      }

      return success(res, doc, 'Created successfully', 201);
    } catch (err) {
      if (err.code === 11000) {
        return error(res, 'Duplicate entry - record already exists', 409);
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return error(res, 'Validation error', 400, messages);
      }
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };
      delete data._id;
      delete data.createdAt;

      if (this.slugField && data[this.slugField] && !data.slug) {
        data.slug = slugify(data[this.slugField]);
      }

      const doc = await this.Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(this.populate);

      if (!doc) {
        return error(res, 'Record not found', 404);
      }

      await logAudit(req.user?.id, `${this.auditAction}_updated`, this.Model.modelName, id, `${this.auditAction} updated`, req);

      return success(res, doc, 'Updated successfully');
    } catch (err) {
      if (err.code === 11000) {
        return error(res, 'Duplicate entry', 409);
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return error(res, 'Validation error', 400, messages);
      }
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const doc = await this.Model.findByIdAndDelete(id);

      if (!doc) {
        return error(res, 'Record not found', 404);
      }

      await logAudit(req.user?.id, `${this.auditAction}_deleted`, this.Model.modelName, id, `${this.auditAction} deleted`, req);

      return success(res, null, 'Deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BaseController;
