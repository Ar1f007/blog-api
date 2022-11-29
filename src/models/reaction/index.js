const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },

    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post id is required'],
    },

    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reaction = model('Reaction', reactionSchema);

module.exports = Reaction;