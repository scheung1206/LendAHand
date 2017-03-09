'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);

router.put ('/:id', auth.isAuthenticated(), controller.update); 
router.patch ('/:id', auth.isAuthenticated(), controller.update); 

router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

//User reviews
router.post('/:id/reviews', auth.isAuthenticated(), controller.createReview);
router.put('/:id/reviews/:reviewId', auth.isAuthenticated(), controller.updateReview);
router.delete('/:id/reviews/:reviewId', auth.isAuthenticated(), controller.destroyReview);
//User reviews

//Reviews like
router.put('/:id/reviews/:reviewId/like', auth.isAuthenticated(), controller.likeReview);
router.delete('/:id/reviews/:reviewId/like', auth.isAuthenticated(), controller.unlikeReview);
//Reviews like

//Reviews report
router.put('/:id/reviews/:reviewId/report', auth.isAuthenticated(), controller.reportReview);
router.delete('/:id/reviews/:reviewId/report', auth.isAuthenticated(), controller.unreportReview);
//Reviews report

router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);

export default router;
 