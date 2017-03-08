// 'use strict';

angular.module('codeApp')
 .controller('ProfileEditCtrl', function ($scope, $http, $location, Auth, $stateParams) {

$scope.user = Auth.getCurrentUser();

$scope.submitEdit = function(){
	console.log('Inside profileEdit controller.. attempting to put');
	$http.put('/api/users/' + $scope.user._id, $scope.user).success(function(){
	console.log('PUT success');
    $location.path('/profile/:id');	
  });
};
});

// angular.module('codeApp')
//   .controller('ProfileCtrl', function ($http,$scope,Auth,$stateParams) {
//     //$scope.user = $stateParams.id//Auth.getCurrentUser();
//     $http.get('/api/users/' + $stateParams.id).success(function(user) {
//       $scope.user = user;
//     });

//     $scope.updateUser = function(){
//       $http.put('/api/users/' + $scope.user._id, $scope.user).success(function(){
//         //console.log('Update CLIENT CONTROLLER');//loadPosts();
//       });
//     }
//   });