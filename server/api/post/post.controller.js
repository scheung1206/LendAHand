/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/posts              ->  index
 * POST    /api/posts              ->  create
 * GET     /api/posts/:id          ->  show
 * PUT     /api/posts/:id          ->  update
 * DELETE  /api/posts/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Post from './post.model';
import User from '../user/user.model';
import graph from 'fbgraph';
var auth = require('../../auth/auth.service');
//console.log("graph");
//console.log(graph);
//console.log(auth);
var friendsList = [];
var friendsUserID = [];
var friendsPostsAll = [];
var accessToken;
var ObjectId = require('mongodb').ObjectID;
//graph.setAccessToken('EAAaSSAEsqNQBAN801q0DnpnKUkZCclPPZBwOZCSdWl8tZAJ2Lasp4gMhb00FQjZCXFVSKCfISaT3pX0ZCFloPMN7830BjAiqTdcQzo1EpiA0CxZBY8PvZBex8gp2uN9CBeZCZCuOM7exqlhZAHGMjeZBZAbNWSVUEwOTu2i8ZD'); //Incorrect Token
var getFriends = function(url) {
    graph.get(url, function (err, res) {
        //console.log(res.data);
        friendsList = res.data;
        // if (res.paging && res.paging.next) {
        //     getFriends(res.paging.next);
        // }
    });
};
//getFriends('/me/friends');

import nodemailer from 'nodemailer';
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mail.lendahand@gmail.com',//'scheung1206@gmail.com',
        pass: 'lendahand123'
    }
}, {
    // default values for sendMail method
    from: 'sender@address',
    headers: {
        'My-Awesome-Header': '123'
    }
});

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function handleUnauthorized(req, res) {
  return function(entity) {
    if (!entity) {return null;}
    if(entity.user._id.toString() !== req.user._id.toString()){
      res.send(403).end();
      return null;
    }
    return entity;
  }
}

// function createComment(req, res) {
//   Post.update({_id: req.params.id}, {$push: {comments: req.body}}, function(err, num) {
//     if(err) { return handleError(res)(err); }
//     if(num === 0) { return res.send(404).end(); }
//     exports.show(req, res);
//   });
// };

// Gets a list of Posts
export function index(req, res) {
  var query = req.query.query && JSON.parse(req.query.query);
  console.log(!query.user && !query.$or);
  if (query.userId)
  {
User.findOne({"_id": query.userId}).exec(function(err,user){
if (err)
{
  console.log('no user');
}
else {
  console.log(user.accesstoken);
  graph.setAccessToken(user.accesstoken);
}
});
// console.log(accessToken);
//   graph.setAccessToken(accessToken); //Incorrect Token
//   console.log(graph.getAccessToken());
getFriends('/me/friends');
  var newFriendslist = [];
  var friendsObject;

  var friendsUser = [];
  var friendsPosts = [];

  //Parse Friends Facebook ID STABLE
  for(var i = 0; i < friendsList.length; i++) {
    delete friendsList[i]['name'];
    newFriendslist.push(friendsList[i].id);
}
console.log(JSON.stringify(newFriendslist));

  //Use Facebook ID to get User STABLE
  User.find({"facebook.id": {"$in": newFriendslist}}).exec(function(err,friends){
    if (err){
      console.log('HELLO WORLD');
    }
    else {
      // Parse User Id from User
      for(var i = 0; i < friends.length; i++) {
        var temp = JSON.stringify(friends[i]._id);
      friendsUser.push(ObjectId.createFromHexString(JSON.parse(temp))); // Incorrect format
    }
    friendsUserID = friendsUser;
    console.log(friendsUser);
  }
  });
  console.log('HELP ' + friendsUserID);//FIX UP SYNTAX
    // if (query.user)
    // {
    //   console.log(query.user);
    //   friendsUser.push(JSON.stringify(query.user));
    // }
    //  Post.find(query).sort({createdAt: -1}).limit(20).execAsync()
    //  .then(respondWithResult(res))
    //  .catch(handleError(res));
      //Post.find({"$or": [{query}, {"user": {"$in": friendsUserID}}]}).sort({createdAt: -1}).limit(20).exec(function(err,posts){
        Post.find({"user": {"$in": friendsUserID}}).sort({createdAt: -1}).limit(20).exec(function(err,posts){
      //Post.find({"user": ObjectId.createFromHexString(JSON.parse(friendsUserID[j]))}).exec(function(err,posts){
        if (err){
          console.log('HELLO WORLD');
        }
        else {
          respondWithResult(res.json(posts));
        }
      });
  //  }
     console.log(friendsPostsAll);
   }
   else{
     Post.find(query).sort({createdAt: -1}).limit(20).execAsync()
     .then(respondWithResult(res))
     .catch(handleError(res));
   }
}

// Gets a single Post from the DB
export function show(req, res) {
  Post.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Post in the DB
export function create(req, res) {
  req.body.user = req.user;
  Post.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Post in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Post.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(handleUnauthorized(req,res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Post from the DB
export function destroy(req, res) {
  Post.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(handleUnauthorized(req,res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function createComment(req, res) {
  req.body.user = req.user;
  console.log(req.body);
  Post.update({_id: req.params.id}, {$push: {comments: req.body}}, function(err, num) {
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
    //Post.updateSearchText(req.params.id);
  });
}

export function destroyComment(req, res) {
  Post.update({_id: req.params.id}, {$pull: {comments: {_id: req.params.commentId , 'user': req.user._id}}}, function(err, num) {
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

export function updateComment(req, res) {
  Post.update({_id: req.params.id, 'comments._id': req.params.commentId}, {'comments.$.content': req.body.content, 'comments.$.user': req.user.id}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

/* like/unlike post */
export function like(req, res) {
  Post.update({_id: req.params.id}, {$push: {likes: req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
export function unlike(req, res) {
  Post.update({_id: req.params.id}, {$pull: {likes: req.user.id}}, function(err, num){
    if(err) { return handleError(res, err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

/* like/unlike comment */
export function likeComment(req, res) {
  Post.update({_id: req.params.id, 'comments._id': req.params.commentId}, {$push: {'comments.$.likes': req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
export function unlikeComment(req, res) {
  Post.update({_id: req.params.id, 'comments._id': req.params.commentId}, {$pull: {'comments.$.likes': req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
export function report(req, res) {
  Post.update({_id: req.params.id}, {$push: {reports: req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
export function unreport(req, res) {
  Post.update({_id: req.params.id}, {$pull: {reports: req.user.id}}, function(err, num){
    if(err) { return handleError(res, err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

/* report/unreport comment */
export function reportComment(req, res) {
  Post.update({_id: req.params.id, 'comments._id': req.params.commentId}, {$push: {'comments.$.reports': req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
export function unreportComment(req, res) {
  Post.update({_id: req.params.id, 'comments._id': req.params.commentId}, {$pull: {'comments.$.reports': req.user.id}}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}
//Send an email when the report button is pressed
export function reportMail(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New service report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Title: ' + data.reportedPost.title + '\n' +
    'Description: ' + data.reportedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  });
}
export function reportCommentMail(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New comment report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Commenter: ' + data.reportedComment.user.name + '\n' +
    'Content: ' + data.reportedComment.content + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  });
}
export function newCommentMail(req, res) {
  var data = req.body;
  console.log(data);
  transporter.sendMail({
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: data.thePost.user.email,
    subject: 'LendAHand Service Comment - ' + data.thePost.title,
    text: 'New service comment from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Comment: ' + data.theComment.content + '\n\n' +
    //'Description: ' + data.reportedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.thePost._id
  });
}
//Send email to shared emails
export function sharePost(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email,
    to: data.toEmail,
    subject: 'LendAHand Recommendation - ' + data.sharedPost.title,
    text: 'New service recommendation from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Title: ' + data.sharedPost.title + '\n' +
    'Description: ' + data.sharedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.sharedPost._id
  });
}
