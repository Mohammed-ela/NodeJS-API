const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please add an email'],
    },
    ingredients: {
      type: [String],
    },
    salt: {
      type: String,
    },
    hash: {
      type: String,
    },
  },
  { collection: 'users' }
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.passwordIsValid = function (password) {
  const generateHash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');

  return this.hash === generateHash;
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET || 'your_default_secret'
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
