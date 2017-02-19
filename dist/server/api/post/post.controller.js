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
exports.star = star;
exports.unstar = unstar;
exports.starComment = starComment;
exports.unstarComment = unstarComment;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _postModel = require('./post.model');

var _postModel2 = _interopRequireDefault(_postModel);

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
    var updated = _lodash2['default'].merge(entity, updates);
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
  var query = req.query.query && JSON.parse(req.query.query);
  _postModel2['default'].find(query).sort({ createdAt: -1 }).limit(20).execAsync().then(respondWithResult(res))['catch'](handleError(res));
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

/* star/unstar post */

function star(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $push: { stars: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unstar(req, res) {
  _postModel2['default'].update({ _id: req.params.id }, { $pull: { stars: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res, err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/* star/unstar comment */

function starComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $push: { 'comments.$.stars': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function unstarComment(req, res) {
  _postModel2['default'].update({ _id: req.params.id, 'comments._id': req.params.commentId }, { $pull: { 'comments.$.stars': req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}
//# sourceMappingURL=post.controller.js.map
