const router = require('express').Router();
const mongoose = require('mongoose');
const BaseController = require('../controllers/BaseController');
const { authenticate, authorize } = require('../middleware/auth');
const Service = require('../models/Service');
const ServiceImage = require('../models/ServiceImage');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');

const controller = new BaseController(Service, {
  searchFields: ['name', 'category'],
  allowedFields: ['*'],
  auditAction: 'service',
  populate: [],
  useSlug: true,
  slugField: 'name',
});

const adminOnly = [authenticate, authorize('Super Admin', 'Admin')];

router.get('/', (req, res, next) => controller.list(req, res, next));

// Services with gallery images embedded (sorted ascending by sortOrder)
router.get('/with-images', async (req, res, next) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {};
    const services = await Service.find(query).sort({ sortOrder: 1, createdAt: 1 });
    const images = await ServiceImage.find({ service: { $in: services.map(s => s._id) } }).sort({ sortOrder: 1, createdAt: 1 });
    const map = {};
    images.forEach(img => {
      (map[String(img.service)] = map[String(img.service)] || []).push(img);
    });
    const data = services.map(s => ({ ...s.toObject(), images: map[String(s._id)] || [] }));
    return success(res, data);
  } catch (err) {
    next(err);
  }
});

// List images for a service (ascending order). Accepts id or slug.
router.get('/:id/images', async (req, res, next) => {
  try {
    const { id } = req.params;
    const serviceDoc = mongoose.Types.ObjectId.isValid(id)
      ? await Service.findById(id)
      : await Service.findOne({ slug: id });
    if (!serviceDoc) return error(res, 'Service not found', 404);
    const images = await ServiceImage.find({ service: serviceDoc._id }).sort({ sortOrder: 1, createdAt: 1 });
    return success(res, images);
  } catch (err) {
    next(err);
  }
});

// Add one or more images to a service (single object or array)
router.post('/:id/images', ...adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const serviceDoc = mongoose.Types.ObjectId.isValid(id)
      ? await Service.findById(id)
      : await Service.findOne({ slug: id });
    if (!serviceDoc) return error(res, 'Service not found', 404);

    const items = Array.isArray(req.body) ? req.body : [req.body];
    const created = [];
    for (const item of items) {
      if (!item.image) continue;
      const count = await ServiceImage.countDocuments({ service: serviceDoc._id });
      const doc = await ServiceImage.create({
        service: serviceDoc._id,
        image: item.image,
        caption: item.caption || '',
        sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : count,
      });
      created.push(doc);
    }
    if (!created.length) return error(res, 'At least one valid image is required', 400);
    await logAudit(req.user?.id, 'service_image_created', 'ServiceImage', serviceDoc._id, `Added ${created.length} image(s) to service`, req);
    return success(res, created.length === 1 ? created[0] : created, 'Images added', 201);
  } catch (err) {
    next(err);
  }
});

// Reorder images for a service. Body: { order: [imageId, ...] } -> ascending sortOrder
router.put('/:id/images/reorder', ...adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = Array.isArray(req.body.order) ? req.body.order : [];
    for (let i = 0; i < order.length; i++) {
      await ServiceImage.updateOne({ _id: order[i], service: id }, { sortOrder: i });
    }
    const images = await ServiceImage.find({ service: id }).sort({ sortOrder: 1, createdAt: 1 });
    await logAudit(req.user?.id, 'service_image_reordered', 'ServiceImage', id, 'Reordered service images', req);
    return success(res, images);
  } catch (err) {
    next(err);
  }
});

// Update a single image (caption / sortOrder / image)
router.put('/images/:imageId', ...adminOnly, async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data._id;
    delete data.service;
    delete data.createdAt;
    delete data.updatedAt;
    const doc = await ServiceImage.findByIdAndUpdate(req.params.imageId, data, { new: true, runValidators: true });
    if (!doc) return error(res, 'Image not found', 404);
    await logAudit(req.user?.id, 'service_image_updated', 'ServiceImage', req.params.imageId, 'Updated service image', req);
    return success(res, doc, 'Image updated');
  } catch (err) {
    next(err);
  }
});

// Delete a single image
router.delete('/images/:imageId', ...adminOnly, async (req, res, next) => {
  try {
    const doc = await ServiceImage.findByIdAndDelete(req.params.imageId);
    if (!doc) return error(res, 'Image not found', 404);
    await logAudit(req.user?.id, 'service_image_deleted', 'ServiceImage', req.params.imageId, 'Deleted service image', req);
    return success(res, null, 'Image deleted');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.post('/', ...adminOnly, (req, res, next) => controller.create(req, res, next));
router.put('/:id', ...adminOnly, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', ...adminOnly, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
