const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "isb8m8bf";
    const apiKey = process.env.CLOUDINARY_API_KEY || "277217182126142";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "QDOXOiqqkGk8BTmx1beJrTZuClc";

    // 1. Try Official Cloudinary Upload Stream if credentials exist
    if (cloudName && apiKey && apiSecret) {
      try {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret
        });

        const cloudinaryResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
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
        console.warn('Cloudinary signed upload note:', cErr.message || cErr);
      }
    }

    // 2. Try Unsigned Cloudinary Presets
    if (cloudName) {
      const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const presets = ['ml_default', 'unsigned', 'nexora_uploads', 'nexora'];
      for (const preset of presets) {
        try {
          const unsignedData = new URLSearchParams();
          unsignedData.append('file', base64File);
          unsignedData.append('upload_preset', preset);

          const unRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: unsignedData.toString()
          });
          const unResult = await unRes.json();
          if (unResult.secure_url) {
            console.log(`✅ Uploaded to Cloudinary (Preset: ${preset}):`, unResult.secure_url);
            return res.status(200).json({ 
              message: 'File uploaded successfully to Cloudinary',
              url: unResult.secure_url,
              fileUrl: unResult.secure_url,
              imageUrl: unResult.secure_url
            });
          }
        } catch (err) {
          // continue to next preset
        }
      }
    }

    // 3. Local Disk Storage Fallback
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
