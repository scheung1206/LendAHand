'use strict';

angular.module('codeApp')
  .controller('ProfileViewCtrl', function ($scope, $http) {
  	// $http.get('/api/profile')
    $scope.message = 'Hello';
  });
