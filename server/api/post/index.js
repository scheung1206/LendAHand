'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.post('/:id/comments', auth.isAuthenticated(), controller.createComment);
router.put('/:id/comments/:commentId', auth.isAuthenticated(), controller.updateComment);
router.delete('/:id/comments/:commentId', auth.isAuthenticated(), controller.destroyComment);

router.put('/:id/star', auth.isAuthenticated(), controller.star);
router.delete('/:id/star', auth.isAuthenticated(), controller.unstar);
router.put('/:id/comments/:commentId/star', auth.isAuthenticated(), controller.starComment);
router.delete('/:id/comments/:commentId/star', auth.isAuthenticated(), controller.unstarComment);

module.exports = router;
