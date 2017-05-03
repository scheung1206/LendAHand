/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/posts              ->  index
 * POST    /api/posts              ->  create
 * GET     /api/posts/:id          ->  show
 * PUT     /api/posts/:id          ->  update
 * DELETE  /api/posts/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.createComment = createComment;
exports.destroyComment = destroyComment;
exports.updateComment = updateComment;
exports.like = like;
exports.unlike = unlike;
exports.likeComment = likeComment;
exports.unlikeComment = unlikeComment;
exports.report = report;
exports.unreport = unreport;
exports.reportComment = reportComment;
exports.unreportComment = unreportComment;
exports.reportMail = reportMail;
exports.reportCommentMail = reportCommentMail;
exports.newCommentMail = newCommentMail;
exports.sharePost = sharePost;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _postModel = require('./post.model');

var _postModel2 = _interopRequireDefault(_postModel);

var _userUserModel = require('../user/user.model');

var _userUserModel2 = _interopRequireDefault(_userUserModel);

var _fbgraph = require('fbgraph');

var _fbgraph2 = _interopRequireDefault(_fbgraph);

// var getFriends = function(url) {
//     graph.get(url, function (err, res) {
//         friendsList = res.data;
//     });
// };
//getFriends('/me/friends');

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var auth = require('../../auth/auth.service');
var accessToken;
var ObjectId = require('mongodb').ObjectID;
var transporter = _nodemailer2['default'].createTransport({
  service: 'gmail',
  auth: {
    user: 'mail.lendahand@gmail.com', //'scheung1206@gmail.com',
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
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _lodash2['default'].extend(entity, updates);
    return updated.saveAsync().spread(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function handleUnauthorized(req, res) {
  return function (entity) {
    if (!entity) {
      return null;
    }
    if (entity.user._id.toString() !== req.user._id.toString()) {
      res.send(403).end();
      return null;
    }
    return entity;
  };
}

// function createComment(req, res) {
//   Post.update({_id: req.params.id}, {$push: {comments: req.body}}, function(err, num) {
//     if(err) { return handleError(res)(err); }
//     if(num === 0) { return res.send(404).end(); }
//     exports.show(req, res);
//   });
// };

// Gets a list of Posts

function index(req, res) {
  //Query based on tab
  var query = req.query.query && JSON.parse(req.query.query);
  // If userId field is present, using Facebook tab
  if (query.userId) {
    _userUserModel2['default'].findOne({ "_id": query.userId }).exec(function (err, user) {
      if (err) {
        console.log('no user');
      } else {
        //Sets Facebook access token of current user
        _fbgraph2['default'].setAccessToken(user.accesstoken);

        //Gets facebook friends from user, puts into 'friendsList'
        _fbgraph2['default'].get("/me/friends", function (err, graph) {
          if (err) {
            console.log('No friends');
          } else {
            // Stores facebook graph information
            var friendsList = graph.data;
            // Stores facebook id of friends
            var newFriendslist = [];
            // Stores User Objects of friends
            var friendsUser = [];
            // Stores User Object ID of friends
            var friendsUserID = [];

            //Parse Friends Facebook ID
            for (var i = 0; i < friendsList.length; i++) {
              delete friendsList[i]['name'];
              newFriendslist.push(friendsList[i].id);
            }

            //Use Facebook ID to get User Objects
            _userUserModel2['default'].find({ "facebook.id": { "$in": newFriendslist } }).exec(function (err, friends) {
              if (err) {
                console.log('HELLO WORLD');
              } else {
                // Parse User Id from User
                for (var i = 0; i < friends.length; i++) {
                  var temp = JSON.stringify(friends[i]._id);
                  friendsUser.push(ObjectId.createFromHexString(JSON.parse(temp))); // Incorrect format
                }
                // Get all posts from friends object id
                _postModel2['default'].find({ "user": { "$in": friendsUser } }).sort({ createdAt: -1 }).limit(20).exec(function (err, posts) {
                  if (err) {
                    console.log('HELLO WORLD');
                  } else {
                    respondWithResult(res.json(posts));
                  }
                });
              }
            });
          } //End of graph query else
        }); //End of graph query
      } //User find one query ELSE end
    }); //End of user find one query
  } else {
      //Standard query from Mine and Liked pages
      _postModel2['default'].find(query).sort({ createdAt: -1 }).limit(20).execAsync().then(respondWithResult(res))['catch'](handleError(res));
    }
}

// Gets a single Post from the DB

function show(req, res) {
  _postModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(respondWithResult(res))['catch'](handleError(res));
}

// Creates a new Post in the DB

function create(req, res) {
  req.body.user = req.user;
  _postModel2['default'].createAsync(req.body).then(respondWithResult(res, 201))['catch'](handleError(res));
}

// Updates an existing Post in the DB

function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  _postModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(handleUnauthorized(req, res)).then(saveUpdates(req.body)).then(respondWithResult(res))['catch'](handleError(res));
}

// Deletes a Post from the DB

function destroy(req, res) {
  _postModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(handleUnauthorized(req, res)).then(removeEntity(res))['catch'](handleError(res));
}

function createComment(req, res) {
  req.body.user = req.user;
  console.log(req.body);
  _postModel2['default'].update({ _id: req.params.id }, { $push: { comments: req.body } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
    //Post.updateSearchText(req.params.id);
  });
}

function destroyComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $pull: { comments: { _id: req.params.commentId, 'user': req.user._id } } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function updateComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { 'comments.$.content': req.body.content, 'comments.$.user': req.user.id }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/* like/unlike post */

function like(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $push: { likes: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unlike(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $pull: { likes: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res, err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/* like/unlike comment */

function likeComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $push: { 'comments.$.likes': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unlikeComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $pull: { 'comments.$.likes': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function report(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $push: { reports: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unreport(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $pull: { reports: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res, err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/* report/unreport comment */

function reportComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $push: { 'comments.$.reports': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unreportComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $pull: { 'comments.$.reports': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

//Send an email when the report button is pressed

function reportMail(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email, //'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New service report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' + 'Title: ' + data.reportedPost.title + '\n' + 'Description: ' + data.reportedPost.description + '\n\n' + 'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  });
}

function reportCommentMail(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email, //'scheung1206@gmail.com',
    to: 'mail.lendahand@gmail.com',
    subject: 'LendAHand Report Notification - ' + data.reportedPost.title,
    text: 'New comment report from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' + 'Commenter: ' + data.reportedComment.user.name + '\n' + 'Content: ' + data.reportedComment.content + '\n\n' + 'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.reportedPost._id
  });
}

function newCommentMail(req, res) {
  var data = req.body;
  console.log(data);
  transporter.sendMail({
    from: data.fromUser.email, //'scheung1206@gmail.com',
    to: data.thePost.user.email,
    subject: 'LendAHand Service Comment - ' + data.thePost.title,
    text: 'New service comment from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' + 'Comment: ' + data.theComment.content + '\n\n' +
    //'Description: ' + data.reportedPost.description + '\n\n' +
    'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.thePost._id
  });
}

//Send email to shared emails

function sharePost(req, res) {
  var data = req.body;

  transporter.sendMail({
    from: data.fromUser.email,
    to: data.toEmail,
    subject: 'LendAHand Recommendation - ' + data.sharedPost.title,
    text: 'New service recommendation from ' + data.fromUser.name + ' - ' + data.fromUser.email + '\n\n' + 'Title: ' + data.sharedPost.title + '\n' + 'Description: ' + data.sharedPost.description + '\n\n' + 'Link to Post: ' + 'http://localhost:9000/posts/show/' + data.sharedPost._id
  });
}
//# sourceMappingURL=post.controller.js.map
