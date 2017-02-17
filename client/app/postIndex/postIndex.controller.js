'use strict';

angular.module('codeApp')
  .controller('PostIndexCtrl', function ($scope,$http, $location,Auth,query) {
    var keyword = $location.search().keyword;
    if(keyword){
      query = _.merge(query, {$text: {$search: keyword}});
    }
    $http.get('/api/posts', {params: {query: query}}).success(function(posts) {
      $scope.posts = posts;
      });
      $scope.isStar = function(obj){
      return Auth.isLoggedIn() && obj && obj.stars && obj.stars.indexOf(Auth.getCurrentUser()._id)!==-1;
    };
  });
