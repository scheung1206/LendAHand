'use strict';

angular.module('codeApp')
  .controller('PostIndexCtrl', function ($scope,$http, $location,Auth,query) {
    var keyword = $location.search().keyword;
    if(keyword){
      query = _.merge(query, {$text: {$search: keyword}});
    }

    $scope.busy = true;
    $scope.noMoreData = false;

    $http.get('/api/posts', {params: {query: query}}).success(function(posts) {
      $scope.posts = posts;
      if($scope.posts.length < 20){
        $scope.noMoreData = true;
      }
      $scope.busy = false;
      });

      $scope.nextPage = function(){
      if($scope.busy){ return; }
      $scope.busy = true;
      var lastId = $scope.posts[$scope.posts.length-1]._id;
      var pageQuery = _.merge(query, {_id: {$lt: lastId}});
      $http.get('/api/posts', {params: {query: pageQuery}}).success(function(posts){
        $scope.posts = $scope.posts.concat(posts);
        $scope.busy = false;
        if(posts.length === 0){
          $scope.noMoreData = true;
        }
      });
    };

      $scope.isLike = function(obj){
      return Auth.isLoggedIn() && obj && obj.likes && obj.likes.indexOf(Auth.getCurrentUser()._id)!==-1;
    };

    $scope.like = function(obj) {
      $http.put('/api/posts/' + obj._id  + '/like').success(function(){
        loadPosts();
      });
    };
    $scope.unlike = function(obj) {
      $http.delete('/api/posts/' + obj._id  + '/like').success(function(){
        loadPosts();
      });
    };
    var loadPosts = function(){
      $http.get('/api/posts', {params: {query: query}}).success(function(posts) {
        $scope.posts = posts;
        if($scope.posts.length < 20){
          $scope.noMoreData = true;
        }
        $scope.busy = false;
        });
    };
  });
