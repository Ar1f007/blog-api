const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'First name is required'] },
    photo: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 5,
      select: false,
    },
    bio: { type: String },
    postCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },

    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ['Admin', 'Guest', 'Blogger'] },

    isFollowing: { type: Boolean, default: false },
    isUnfollowing: { type: Boolean, default: false },

    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: { type: String },
    accountVerificationTokenExpires: { type: Date },

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash user password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
