'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router['delete']('/:id', auth.isAuthenticated(), controller.destroy);

router.post('/:id/comments', auth.isAuthenticated(), controller.createComment);
router.put('/:id/comments/:commentId', auth.isAuthenticated(), controller.updateComment);
router['delete']('/:id/comments/:commentId', auth.isAuthenticated(), controller.destroyComment);

router.put('/:id/like', auth.isAuthenticated(), controller.like);
router['delete']('/:id/like', auth.isAuthenticated(), controller.unlike);
router.put('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.likeComment);
router['delete']('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.unlikeComment);

module.exports = router;
//# sourceMappingURL=index.js.map
