'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// router.get('/friends', controller.friend);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

//Post comments
router.post('/:id/comments', auth.isAuthenticated(), controller.createComment);
router.put('/:id/comments/:commentId', auth.isAuthenticated(), controller.updateComment);
router.delete('/:id/comments/:commentId', auth.isAuthenticated(), controller.destroyComment);
// Post comments

router.put('/:id/like', auth.isAuthenticated(), controller.like);
router.delete('/:id/like', auth.isAuthenticated(), controller.unlike);

//Comments
router.put('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.likeComment);
router.delete('/:id/comments/:commentId/like', auth.isAuthenticated(), controller.unlikeComment);
//Comments

router.put('/:id/report', auth.isAuthenticated(), controller.report);
router.delete('/:id/report', auth.isAuthenticated(), controller.unreport);

//Comments
router.put('/:id/comments/:commentId/report', auth.isAuthenticated(), controller.reportComment);
router.delete('/:id/comments/:commentId/report', auth.isAuthenticated(), controller.unreportComment);
//Comments

router.post('/send', auth.isAuthenticated(),controller.reportMail);
router.post('/share', auth.isAuthenticated(),controller.sharePost);
router.post('/reportComment', auth.isAuthenticated(),controller.reportCommentMail);
router.post('/newComment', auth.isAuthenticated(),controller.newCommentMail);

router.post('/:id/accept', auth.isAuthenticated(), controller.acceptServicer);
router.post('/:id/complete', auth.isAuthenticated(), controller.serviceComplete);
router.post('/:id/remove', auth.isAuthenticated(), controller.servicerRemove);


module.exports = router;
