const { StatusCodes } = require('http-status-codes');
const AppError = require('./appError');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

exports.uploadToCloudinary = async (
  rootDir = 'photos',
  fileToUpload,
  folder
) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      folder: `${rootDir}/${folder}`,
    });

    return data.secure_url;
  } catch (error) {
    return new AppError(
      'Something went wrong! Could not upload image, try again after sometime.',
      StatusCodes.CONFLICT
    );
  }
};