'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profileEdit', {
        url: '/profileEdit/:id',
        templateUrl: 'app/profileEdit/profileEdit.html',
        controller: 'ProfileEditCtrl',
        sp: {
  		authenticate: true
		}
      });
  });
