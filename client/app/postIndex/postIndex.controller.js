'use strict';

angular.module('codeApp')
  .controller('PostIndexCtrl', function ($scope,$http,Auth,query) {
    $http.get('/api/posts', {params: {query: query}}).success(function(posts) {
      $scope.posts = posts;
      });
      $scope.isStar = function(obj){
      return Auth.isLoggedIn() && obj && obj.stars && obj.stars.indexOf(Auth.getCurrentUser()._id)!==-1;
    };
  });
