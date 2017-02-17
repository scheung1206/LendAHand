'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('postShow', {
        url: '/posts/show/:id',
        templateUrl: 'app/postShow/postShow.html',
        controller: 'PostShowCtrl'
      });
  });
