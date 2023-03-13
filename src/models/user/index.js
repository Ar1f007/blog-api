const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, index: true },
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
    bio: { type: String, default: '' },
    postCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },

    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['admin', 'guest', 'user', 'blogger'],
      default: 'user',
    },

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
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Check password with db hash
 * @param {string} enteredPassword
 * @returns Promise<boolean>
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generates verification token for the user
 * @returns {String} token
 */
userSchema.methods.generateAccountVerificationToken = async function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.accountVerificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return token;
};

userSchema.methods.createPasswordResetCode = async function () {
  const code = crypto.randomBytes(3).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return code;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
