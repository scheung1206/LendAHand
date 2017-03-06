'use strict';

angular.module('codeApp')
  .controller('ProfileCtrl', function ($http,$scope,Auth,$stateParams) {
    //$scope.user = $stateParams.id//Auth.getCurrentUser();
    $http.get('/api/users/' + $stateParams.id).success(function(user) {
      $scope.user = user;
    });

    $scope.updateUser = function(){
      $http.put('/api/users/' + $stateParams.id, $scope.user).success(function(){
        //console.log('Update CLIENT CONTROLLER');//loadPosts();
      });
    }
  });
