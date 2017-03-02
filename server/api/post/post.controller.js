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

import nodemailer from 'nodemailer';
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'scheung1206@gmail.com',
        pass: ''
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
  Post.find(query).sort({createdAt: -1}).limit(20).execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
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
export function sendMail(req, res) {
  transporter.sendMail({
    from: 'scheung1206@gmail.com',
    to: 'scheung1206@gmail.com',
    subject: 'Hello',
    text: 'Hello World'
  });
}
//Send email to shared emails
export function sharePost(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email,
    to: data.toEmail,
    subject: 'LendAHand Recommendation - ' + data.sharedPost.title,
    text: 'New service recommendation from ' + data.fromUser.name + '\n\n' +
    'Title: ' + data.sharedPost.title + '\n' +
    'Description: ' + data.sharedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.sharedPost._id
  });
}
