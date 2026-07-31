const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { success, error } = require('../utils/response');
const { logAudit } = require('../utils/audit');

router.post('/', authenticate, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return error(res, err.message, 400);
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'No file uploaded', 400);
    }

    const category = req.query.category || 'general';
    const filePath = `/uploads/${category}/${req.file.filename}`;

    await logAudit(req.user.id, 'file_uploaded', 'uploads', null, `File uploaded: ${req.file.filename}`, req);

    return success(res, {
      filename: req.file.filename,
      original_name: req.file.originalname,
      path: filePath,
      size: req.file.size,
      mime_type: req.file.mimetype,
    }, 'File uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.post('/multiple', authenticate, (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) return error(res, err.message, 400);
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return error(res, 'No files uploaded', 400);
    }

    const category = req.query.category || 'general';
    const files = req.files.map(f => ({
      filename: f.filename,
      original_name: f.originalname,
      path: `/uploads/${category}/${f.filename}`,
      size: f.size,
      mime_type: f.mimetype,
    }));

    return success(res, files, 'Files uploaded successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.delete('/:filename', authenticate, authorize('Super Admin', 'Admin'), async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return success(res, null, 'File deleted');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
