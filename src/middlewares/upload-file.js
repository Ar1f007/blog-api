const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image! Only images are allowed',
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
const uploadCoverImage = uploadFiles.single('coverImage');

const resizeAvatar = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.userId}-${Date.now()}.webp`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('webp')
    .webp({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const resizeCoverImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.userId}-${Date.now()}.webp`;

  await sharp(req.file.buffer)
    .resize({ width: 820, height: 320 })
    .toFormat('webp')
    .webp({ quality: 90 })
    .toFile(`public/img/posts/${req.file.filename}`);

  next();
};

module.exports = { 
  resizeAvatar, 
  resizeCoverImage,
  uploadAvatar, 
  uploadCoverImage, 
 };