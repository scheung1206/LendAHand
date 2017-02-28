'use strict';

angular.module('codeApp')
  .controller('ProfileEditCtrl', function ($scope, $http, $location, Auth) {
$scope.submitEdit = function(){
	console.log('Inside profileEdit controller.. attempting to post');
	$http.post('/api/profiles', $scope.profile).success(function(){
	console.log('Post success');
    $location.path('/profile');	
  });
};
});
