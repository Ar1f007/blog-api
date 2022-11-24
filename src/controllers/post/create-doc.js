const { StatusCodes } = require('http-status-codes');
const { slugify, AppError } = require('../../utils');

/**
 *  Create a new document
 * @param {Model} Model - mongoose model
 * @param {string} name - name of the model property
 * @returns new doc id
 */
exports.create = async (Model, name) => {
  const slug = slugify(name);

  try {
    const newDoc = await Model.create({ name, slug });
    return newDoc._id;
  } catch (error) {
    throw new AppError('Tag/Category already exists', StatusCodes.CONFLICT);
  }
};