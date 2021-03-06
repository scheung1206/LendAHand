'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;
exports.create = create;
exports.update = update;
exports.createReview = createReview;
exports.destroyReview = destroyReview;
exports.updateReview = updateReview;
exports.show = show;
exports.update = update;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.like = like;
exports.unlike = unlike;
exports.authCallback = authCallback;

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

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
    var updated = _.extend(entity, updates);
    return updated.saveAsync().spread(function (updated) {
      return updated;
    });
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

/**
 * Get list of users
 * restriction: 'admin'
 */

function index(req, res) {
  _userModel2['default'].findAsync({}, '-salt -password').then(function (users) {
    res.status(200).json(users);
  })['catch'](handleError(res));
}

/**
 * Creates a new user
 */

function create(req, res, next) {
  var newUser = new _userModel2['default'](req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync().spread(function (user) {
    var token = _jsonwebtoken2['default'].sign({ _id: user._id }, _configEnvironment2['default'].secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token: token });
  })['catch'](validationError(res));
}

// Update user info
// export function update (req, res){
//   var userId = req.user._id;
//   var newName = req.body.name;
//   var newSkills = req.body.background.skills;
//   var newBiography = req.body.background.biography;
//   var newLocation = req.body.background.location;
//   User.findByIdAsync(userId) //Modify to accomadate for user updates instead
//     .then(user => {
//         user.name = newName;
//         user.background.skills = newSkills;
//         user.background.location = newLocation;
//         user.background.biography = newBiography;
//         return user.saveAsync()
//           .then(() => {
//             res.status(204).end();
//           })
//           .catch(validationError(res));
//     });
// }

function update(req, res) {
  //stevens
  console.log(req.body);
  var userId = req.user._id;
  var newBio = req.body.background.biography;
  console.log(newBio);
  console.log(req.user._id);

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    console.log(user);
    console.log(req.user);

    user.background.biography = newBio;
    return user.saveAsync().then(function () {
      res.status(204).end();
    })['catch'](validationError(res));
  });
}

//Post review on Profile code

function createReview(req, res) {
  req.body.user = req.user;
  console.log(req.body);
  _userModel2['default'].update({ _id: req.params.id }, { $push: { reviews: req.body } }, function (err, num) {
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

function destroyReview(req, res) {
  _userModel2['default'].update({ _id: req.params.id }, { $pull: { reviews: { _id: req.params.reviewId, 'user': req.user._id } } }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

function updateReview(req, res) {
  _userModel2['default'].update({ _id: req.params.id, 'reviews._id': req.params.reviewId }, { 'reviews.$.content': req.body.content, 'reviews.$.rating': req.body.rating, 'reviews.$.user': req.user.id }, function (err, num) {
    if (err) {
      return handleError(res)(err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/**
 * Get a single user
 */

function show(req, res, next) {
  var userId = req.params.id;

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  })['catch'](function (err) {
    return next(err);
  });
}

function update(req, res) {
  console.log(req.body);
  var userId = req.user._id;
  var newName = req.body.name;
  var newBio = req.body.background.biography;
  var newSkills = req.body.background.skills;
  var newHobbies = req.body.background.hobbies;
  var newImage = req.body.background.image;
  console.log(newSkills);
  console.log(req.user._id);

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    //console.log(user);
    //  console.log(req.user);
    user.name = newName;
    user.background.biography = newBio;
    user.background.skills = newSkills;
    user.background.hobbies = newHobbies;
    user.background.image = newImage;
    return user.saveAsync().then(function () {
      res.status(204).end();
    })['catch'](validationError(res));
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */

function destroy(req, res) {
  _userModel2['default'].findByIdAndRemoveAsync(req.params.id).then(function () {
    res.status(204).end();
  })['catch'](handleError(res));
}

/**
 * Change a users password
 */

function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  _userModel2['default'].findByIdAsync(userId).then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.saveAsync().then(function () {
        res.status(204).end();
      })['catch'](validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */

function me(req, res, next) {
  var userId = req.user._id;

  _userModel2['default'].findOneAsync({ _id: userId }, '-salt -password').then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  })['catch'](function (err) {
    return next(err);
  });
}

function like(req, res) {
  _userModel2['default'].update({ _id: req.params.id }, { $push: { likes: req.user.id } }, function (err, num) {
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
  _userModel2['default'].update({ _id: req.params.id }, { $pull: { likes: req.user.id } }, function (err, num) {
    if (err) {
      return handleError(res, err);
    }
    if (num === 0) {
      return res.send(404).end();
    }
    exports.show(req, res);
  });
}

/**
 * Authentication callback
 */

function authCallback(req, res, next) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
