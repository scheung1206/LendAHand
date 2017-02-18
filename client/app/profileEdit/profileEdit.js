'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profileEdit', {
        url: '/profileEdit',
        templateUrl: 'app/profileEdit/profileEdit.html',
        controller: 'ProfileEditCtrl'
      });
  });
