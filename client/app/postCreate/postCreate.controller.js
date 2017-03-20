'use strict';

angular.module('codeApp')
  .controller('PostCreateCtrl', function ($scope,$http, $location, Auth) {
  	if(! Auth.isLoggedIn()){
         $location.path('/login');
         $location.replace();
         return;
       }
    $scope.submit = function() {
      $http.post('/api/posts', $scope.post).success(function(){
      	console.log('submitted post');
        $location.path('/');
      });
    };
  });
