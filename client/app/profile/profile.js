'use strict';

angular.module('codeApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('profile', {
url: '/profile',
templateUrl: 'app/profile/profile.html',
controller: 'ProfileCtrl',
sp: {
  authenticate: true
}
});
  });
