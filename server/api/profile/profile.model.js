'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProfileSchema = new mongoose.Schema({
  profileName: String,
  skills: String,
  //active: Boolean,
  //transactionHistory: String,
  //photo: String,
  aboutMe: String,
  location: String,
  createdAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
    type: Date,
    default: Date.now
  },
  profileImageURL: {
    type: String,
    default: 'client/assets/images/default.png'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
});

export default mongoose.model('Profile', ProfileSchema);
