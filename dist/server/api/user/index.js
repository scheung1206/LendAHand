'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _userController = require('./user.controller');

var controller = _interopRequireWildcard(_userController);

// import * as controllerPost from '../post/post.controller';

var _authAuthService = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_authAuthService);

var router = new _express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router['delete']('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);

router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);

router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

//User reviews
router.post('/:id/reviews', auth.isAuthenticated(), controller.createReview);
router.put('/:id/reviews/:reviewId', auth.isAuthenticated(), controller.updateReview);
router['delete']('/:id/reviews/:reviewId', auth.isAuthenticated(), controller.destroyReview);
//User reviews

router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);

router.put('/:id/reviews/:reviewId/like', auth.isAuthenticated(), controller.like);

exports['default'] = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
