const multer = require('multer')

// multer config for file uploads
const upload = multer({
  storage: multer.memoryStorage(),  // Store file in memory as Buffer
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      // 'application/msword',
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
  },
});

// //multer error handler middleware 
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if(err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'File size must be less than 10MB'
            })
        } 
    } else if (err) { 
        return res.status(400).json({
            error: 'File upload error',
            message: err.message
        })
    }
    next()
}

//=========================
module.exports = {upload, handleMulterError}