'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  serviceDate: Date,
  reviewWritten: {
    type: Boolean,
    default: false
  },
  servicer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  progress: {
    type: String,
    default: "Open"
  },
  //active: Boolean,
  comments: [{
    content: String,
    requested: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    reports: [{
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
  likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
  reports: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
});

PostSchema.pre('find', function(next){
  this.populate('user');
  this.populate('comments.user', 'name');
  next();
});
PostSchema.pre('findOne', function(next){
  this.populate('user');
  this.populate('comments.user');
  this.populate('servicer');
  next();
});

PostSchema.index({
  'title': 'text',
  'description': 'text',
  'tags.text': 'text',
  'comments.content': 'text',
}, {name: 'post_schema_index'});

export default mongoose.model('Post', PostSchema);
