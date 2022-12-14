const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
      index: true,
    },
    user: {
      type: Object,
      required: [true, 'Commenter details (id, full name) is required'],
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
