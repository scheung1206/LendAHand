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

router.put('/:id/like', auth.isAuthenticated(), controller.like);
router.delete('/:id/like', auth.isAuthenticated(), controller.unlike);
router.put('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.likeComment);
router.delete('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.unlikeComment);

router.put('/:id/report', auth.isAuthenticated(), controller.report);
router.delete('/:id/report', auth.isAuthenticated(), controller.unreport);
router.put('/:id/comments/:commentId/report', auth.isAuthenticated(), controller.reportComment);
router.delete('/:id/comments/:commentId/report', auth.isAuthenticated(), controller.unreportComment);

router.post('/send', auth.isAuthenticated(),controller.reportMail);
router.post('/share', auth.isAuthenticated(),controller.sharePost);
router.post('/reportComment', auth.isAuthenticated(),controller.reportCommentMail);
router.post('/newComment', auth.isAuthenticated(),controller.newCommentMail);

module.exports = router;
