const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { upload, uploadImage } = require('../controllers/upload.controller');

router.post('/:type', protect, restrictTo('vendor'), upload.single('image'), uploadImage);

module.exports = router;
