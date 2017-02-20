'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profileView', {
        url: '/profile',
        templateUrl: 'app/profileView/profileView.html',
        controller: 'ProfileViewCtrl'
      });
  });
