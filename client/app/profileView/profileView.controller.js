'use strict';

angular.module('codeApp')
  .controller('ProfileViewCtrl', function ($scope, $http,$stateParams,Auth,$location) {
  		$http.get('/api/users/' + $stateParams.id).success(function(user){
  	    $scope.user = user;
  		});
    });

