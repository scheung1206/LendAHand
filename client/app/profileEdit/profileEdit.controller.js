'use strict';

angular.module('codeApp')
  .controller('ProfileEditCtrl', function ($scope, $http, $location) {
$scope.submitEdit = function(){
	$http.post('/api/profile', $scope.profile).success(function(){
	$location.path('/');	
  });
};
});
