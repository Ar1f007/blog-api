const { Schema, model } = require('mongoose');

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
      index: true,
    },

    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post id is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = model('Reaction', bookmarkSchema);

module.exports = Bookmark;