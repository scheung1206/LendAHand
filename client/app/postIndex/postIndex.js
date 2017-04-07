'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/?keyword',
        templateUrl: 'app/postIndex/postIndex.html',
        controller: 'PostIndexCtrl',
        resolve: {
          query: function(){return {};}
        },
      })
      .state('likedPostsIndex', {
        url: '/users/:userId/liked',
        templateUrl: 'app/postIndex/postIndex.html',
        controller: 'PostIndexCtrl',
        resolve: {
          query: function($stateParams){
            return {
              $or: [
                {'likes': $stateParams.userId},
                {'comments.likes': $stateParams.userId},
              ]
            };
          }
        },
      })
      .state('userPostsIndex', {
        url: '/users/:userId',
        templateUrl: 'app/postIndex/postIndex.html',
        controller: 'PostIndexCtrl',
        resolve: {
          query: function($stateParams){
            return {user: $stateParams.userId};
          }
        },
      })
      .state('userFriendIndex', {
        url: '/friends/:userId',
        templateUrl: 'app/postIndex/postIndex.html',
        controller: 'PostIndexCtrl',
        resolve: {
          query: function($stateParams){
            return {userId: $stateParams.userId};
          }
        },
      });

  });
