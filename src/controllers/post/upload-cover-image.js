const { uploadToCloudinary } = require('../../utils');
const { unlink } = require('fs/promises');

exports.uploadCoverImage = async (filename) => {
  const filePath = `public/img/posts/${filename}`;
  const imgUrl = await uploadToCloudinary(filePath, 'posts');

  await unlink(filePath);

  return imgUrl;
};