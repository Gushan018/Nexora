const express = require('express');
const router = express.Router();
const { uploadFile, upload } = require('../controllers/upload.controller');

const anyUpload = upload.any();

const handleUpload = (req, res, next) => {
  anyUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload failed.' });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    return uploadFile(req, res);
  });
};

router.post('/', handleUpload);
router.post('/single', handleUpload);
router.post('/image', handleUpload);
router.post('/banner', handleUpload);
router.post('/logo', handleUpload);

module.exports = router;
