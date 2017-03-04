'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('profile', {
url: '/profile/:id',
templateUrl: 'app/profile/profile.html',
controller: 'ProfileCtrl',
sp: {
  authenticate: true
}
});
  });
