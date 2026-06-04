const express = require('express');
const router = express.Router();
const { uploadFile, upload } = require('../controllers/upload.controller');

// POST /api/upload
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
