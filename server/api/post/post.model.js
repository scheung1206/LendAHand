'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  //active: Boolean,
  comments: [{
    content: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    stars: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
  }],
  tags: [{
    text:String,
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stars: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
});

PostSchema.pre('find', function(next){
  this.populate('user', 'name');
  this.populate('comments.user', 'name');
  next();
});
PostSchema.pre('findOne', function(next){
  this.populate('user', 'name');
  this.populate('comments.user', 'name');
  next();
});

export default mongoose.model('Post', PostSchema);
