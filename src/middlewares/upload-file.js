const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const sharp = require('sharp');

// upload to server memory for temporary time
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image! lease upload only images',
        StatusCodes.BAD_REQUEST
      ),
      false
    );
  }
};

const uploadFiles = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1 mb max allowed
});

const uploadAvatar = uploadFiles.single('avatar');

const resizeAvatar = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.userId}-${Date.now()}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('webp')
    .webp({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

module.exports = { uploadAvatar, resizeAvatar };