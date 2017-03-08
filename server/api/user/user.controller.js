'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


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

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAsync({}, '-salt -password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
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

export function update(req, res) { //stevens
  console.log(req.body);
  var userId = req.user._id;
  var newBio = req.body.background.biography;
  console.log(newBio);
  console.log(req.user._id);

  User.findByIdAsync(userId)
    .then(user => {
        console.log(user);
          console.log(req.user);

        user.background.biography = newBio;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));

    });
}

//Post review on Profile code
export function createReview(req, res) {
  req.body.user = req.user;
  console.log(req.body);
  User.update({_id: req.params.id}, {$push: {reviews: req.body}}, function(err, num) {
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
    //Post.updateSearchText(req.params.id);
  });
}

export function destroyReview(req, res) {
  User.update({_id: req.params.id}, {$pull: {reviews: {_id: req.params.reviewId , 'user': req.user._id}}}, function(err, num) {
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

export function updateReview(req, res) {
  User.update({_id: req.params.id, 'reviews._id': req.params.reviewId}, {'reviews.$.content': req.body.content, 'reviews.$.rating': req.body.rating, 'reviews.$.user': req.user.id}, function(err, num){
    if(err) { return handleError(res)(err); }
    if(num === 0) { return res.send(404).end(); }
    exports.show(req, res);
  });
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

export function update(req, res) {
  console.log(req.body);
  var userId = req.user._id;
  var newName = req.body.name;
  var newBio = req.body.background.biography;
  var newSkills = req.body.background.skills;
  var newHobbies = req.body.background.hobbies;
  var newImage = req.body.background.image;
  console.log(newSkills);
  console.log(req.user._id);

  User.findByIdAsync(userId)
    .then(user => {
        //console.log(user);
        //  console.log(req.user);
        user.name = newName;
        user.background.biography = newBio;
        user.background.skills = newSkills;
        user.background.hobbies = newHobbies;
        user.background.image = newImage;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));

    });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
