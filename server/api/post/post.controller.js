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
var accessToken;
var ObjectId = require('mongodb').ObjectID;
// var getFriends = function(url) {
//     graph.get(url, function (err, res) {
//         friendsList = res.data;
//     });
// };
//getFriends('/me/friends');

import nodemailer from 'nodemailer';
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mail.lendahand@gmail.com',//'scheung1206@gmail.com',
        pass: 'lendahand123'
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
  //Query based on tab
  var query = req.query.query && JSON.parse(req.query.query);
  // If userId field is present, using Facebook tab
  if (query.userId)
  {
User.findOne({"_id": query.userId}).exec(function(err,user){
if (err)
{
  console.log('no user');
}
else {
  //Sets Facebook access token of current user
  graph.setAccessToken(user.accesstoken);

  //Gets facebook friends from user, puts into 'friendsList'
  graph.get("/me/friends", function (err, graph) {
      if (err){
        console.log('No friends');
      }
      else{
        // Stores facebook graph information
        var friendsList = graph.data;
        // Stores facebook id of friends
        var newFriendslist = [];
        // Stores User Objects of friends
        var friendsUser = [];
        // Stores User Object ID of friends
        var friendsUserID = [];

        //Parse Friends Facebook ID
        for(var i = 0; i < friendsList.length; i++) {
          delete friendsList[i]['name'];
          newFriendslist.push(friendsList[i].id);
      }

        //Use Facebook ID to get User Objects
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
            // Get all posts from friends object id
            Post.find({"user": {"$in": friendsUser}}).sort({createdAt: -1}).limit(20).exec(function(err,posts){
                  if (err){
                  console.log('HELLO WORLD');
                }
                else {
                  respondWithResult(res.json(posts));
                }
              });
        }
        });
    } //End of graph query else
  }); //End of graph query
}//User find one query ELSE end
}); //End of user find one query
   }
   else{
     //Standard query from Mine and Liked pages
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

var mailReport = {
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New service report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Title: ' + data.reportedPost.title + '\n' +
    'Description: ' + data.reportedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  };

  transporter.sendMail(mailReport, (error, info) => {
    if (error) {
      return console.log(error);
    }
    else {
      console.log('Sent');
        res.sendStatus(200);
    }
  });
  transporter.close();
}
export function reportCommentMail(req, res) {
  var data = req.body;

  var mailReportComment = {
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New comment report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Commenter: ' + data.reportedComment.user.name + '\n' +
    'Content: ' + data.reportedComment.content + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  };

  transporter.sendMail(mailReportComment, (error, info) => {
    if (error) {
      return console.log(error);
    }
    else {
      console.log('Sent');
        res.sendStatus(200);
    }
  });
  transporter.close();
}
export function newCommentMail(req, res) {
  var data = req.body;
  var mailComment = {
    from: data.fromUser.email,//'scheung1206@gmail.com',
    to: data.thePost.user.email,
    subject: 'LendAHand Service Comment - ' + data.thePost.title,
    text: 'New service comment from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Comment: ' + data.theComment.content + '\n\n' +
    //'Description: ' + data.reportedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.thePost._id
  };

  transporter.sendMail(mailComment, (error, info) => {
    if (error) {
      return console.log(error);
    }
    else {
      console.log('Sent');
      res.sendStatus(200);
    }
  });
  transporter.close();
}
//Send email to shared emails
export function sharePost(req, res) {
  var data = req.body;

  var mailShare = {
    from: data.fromUser.email,
    to: data.toEmail,
    subject: 'LendAHand Recommendation - ' + data.sharedPost.title,
    text: 'New service recommendation from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' +
    'Title: ' + data.sharedPost.title + '\n' +
    'Description: ' + data.sharedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.sharedPost._id
  };

  transporter.sendMail(mailShare, (error, info) => {
    if (error) {
      return console.log(error);
    }
    else {
      console.log('Sent');
        res.sendStatus(200);
    }
  });
  transporter.close();
}

export function acceptServicer(req, res) {
  var data = req.body;
  console.log(data);
  Post.findByIdAsync(req.params.id).then(post => {
        post.servicer = data.servicer;
        post.progress = "In Progress";
        return post.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(handleError(res));

    });
}

export function serviceComplete(req, res) {
  Post.findByIdAsync(req.params.id).then(post => {
        post.progress = "Closed";
        return post.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(handleError(res));

    });
}

export function servicerRemove(req, res) {
  Post.findByIdAsync(req.params.id).then(post => {
        post.servicer = undefined;
        post.progress = "Open";
        return post.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(handleError(res));

    });
}

export function reviewedUser(req, res) {
  Post.findByIdAsync(req.params.id).then(post => {
        post.reviewWritten = true;
        post.progress = "Closed";
        return post.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(handleError(res));

    });
}
