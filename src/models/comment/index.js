const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    postSlug: {
      type: String,
      required: [true, 'Post slug is required'],
      ref: 'Post',
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
      index: true,
    },
    commenter: {
      type: ObjectId,
      ref: 'User',
    },
    commentDesc: {
      type: String,
      required: [true, 'Comment description is something'],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
