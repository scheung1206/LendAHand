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
      .state('starredPostsIndex', {
        url: '/users/:userId/starred',
        templateUrl: 'app/postIndex/postIndex.html',
        controller: 'PostIndexCtrl',
        resolve: {
          query: function($stateParams){
            return {
              $or: [
                {'stars': $stateParams.userId},
                {'comments.stars': $stateParams.userId},
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
      });

  });
