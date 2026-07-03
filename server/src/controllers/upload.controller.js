const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDirs = {
  banner: 'banners',
  logo: 'logos',
  package: 'packages',
};

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

Object.values(uploadDirs).forEach((dir) => {
  const fullPath = path.join(UPLOAD_ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type;
    const subDir = uploadDirs[type] || 'misc';
    cb(null, path.join(UPLOAD_ROOT, subDir));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const type = req.params.type;
    const subDir = uploadDirs[type] || 'misc';
    const url = `http://localhost:${process.env.PORT || 5000}/uploads/${subDir}/${req.file.filename}`;

    res.status(200).json({ url, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = { upload, uploadImage };
