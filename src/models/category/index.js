const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category is required'],
      max: 25,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, converted) => {
        delete converted._id;
      },
    },
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;