const multer = require('multer');

// upload to server memory for temporary time
const storage = multer.memoryStorage();

const filterMimes = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format, only image is allowed' }, false);
  }
};

const uploadFiles = multer({
  storage,
  fileFilter: filterMimes,
  limits: { fileSize: 1000000 }, // 1 mb max allowed
});

module.exports = uploadFiles;