const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.query.category || req.body.category || 'general';
    const dir = path.join(uploadDir, category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = /^(image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats|octet-stream)|text\/)/;
  const allowedExts = /\.(jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|csv)$/i;
  if (allowedMimes.test(file.mimetype) || allowedExts.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
