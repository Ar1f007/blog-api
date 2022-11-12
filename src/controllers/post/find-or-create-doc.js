const { StatusCodes } = require('http-status-codes');
const { slugify, AppError } = require('../../utils');

/**
 *  Find the document or create a new document
 * @param {Model} Model - mongoose model
 * @param {string} name - name of the model property
 * @returns existing id or creates a new doc and send back its id
 */
exports.findOrCreateOne = async (Model, name) => {
  const slug = slugify(name);

  try {
    const doc = await Model.findOne({ slug }).lean().exec();

    if (!doc) {
      const newDoc = await Model.create({ name, slug });
      return newDoc._id;
    }

    return doc._id;
  } catch (error) {
    throw new AppError(error?.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};