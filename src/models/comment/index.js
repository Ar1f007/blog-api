const mongoose = require('mongoose');

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
    user: {
      type: Object,
      required: [true, 'Commenter details is required'],
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
