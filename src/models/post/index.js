const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Schema.Types;

const postSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    category: { type: ObjectId, ref: 'Category', required: true },

    tags: [{ type: ObjectId, ref: 'Tag' }],

    numViews: {
      type: Number,
      default: 0,
    },

    isLiked: { type: Boolean, default: false },

    likes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],

    likesCount: { type: Number, default: 0 },

    authorId: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    description: {
      type: String,
      required: [true, 'Post description is required'],
    },

    coverImage: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/05/31/10/55/man-791049_960_720.jpg',
    },
    published_at: {
      type: Date,
      required: [true, 'A date is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;