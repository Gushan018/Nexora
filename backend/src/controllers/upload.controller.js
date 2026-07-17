const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'isb8m8bf',
  api_key: process.env.CLOUDINARY_API_KEY || '277217182126142',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QDOXOiqqkGk8BTmx1beJrTZuClc'
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // 1. Try Official Cloudinary Upload Stream
    try {
      const cloudinaryResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'nexora_uploads' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      if (cloudinaryResult && cloudinaryResult.secure_url) {
        console.log('✅ Uploaded to Cloudinary:', cloudinaryResult.secure_url);
        return res.status(200).json({ 
          message: 'File uploaded successfully to Cloudinary',
          url: cloudinaryResult.secure_url,
          fileUrl: cloudinaryResult.secure_url,
          imageUrl: cloudinaryResult.secure_url
        });
      }
    } catch (cErr) {
      console.warn('Cloudinary upload attempt note:', cErr.message || cErr);
    }

    // 2. Local Disk Fallback (saves cleanly into uploads folder)
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = path.extname(req.file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);
    const localUrl = `/uploads/${filename}`;

    console.log('✅ Saved file locally:', localUrl);
    return res.status(200).json({
      message: 'File uploaded successfully',
      url: localUrl,
      fileUrl: localUrl,
      imageUrl: localUrl
    });

  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  upload,
  uploadFile
};
