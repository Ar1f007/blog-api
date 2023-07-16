const { CLOUDINARY_ROOT_DIR_NAME } = require('../../constants');
const { uploadToCloudinary } = require('../../utils');
const { unlink } = require('fs/promises');

/**
 *
 * @param {string | undefined } rootDir
 * @param {string} filename
 * @returns
 */
exports.uploadCoverImage = async (
  rootDir = CLOUDINARY_ROOT_DIR_NAME,
  filename
) => {
  const filePath = `public/img/posts/${filename}`;
  const imgUrl = await uploadToCloudinary(rootDir, filePath, 'posts');

  await unlink(filePath);

  return imgUrl;
};