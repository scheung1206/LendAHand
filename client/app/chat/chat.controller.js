'use strict';

angular.module('codeApp')
  .controller('ChatCtrl', function ($scope,$stateParams,Auth,$http) {
    $http.get('/api/posts/' + $stateParams.id).success(function(post) {
    $scope.post = post;
    $scope.user = Auth.getCurrentUser();
  });
  });
