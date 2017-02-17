'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('postCreate', {
        url: '/posts/create',
        templateUrl: 'app/postCreate/postCreate.html',
        controller: 'PostCreateCtrl'
      });
  });
