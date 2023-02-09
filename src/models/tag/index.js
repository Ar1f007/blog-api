const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      max: 20,
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

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;