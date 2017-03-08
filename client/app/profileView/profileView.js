'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profileView', {
        url: '/profile/:id',
        templateUrl: 'app/profileView/profileView.html',
        controller: 'ProfileViewCtrl',
        sp:{
    		authenticate: true
  		}
      });
  });
