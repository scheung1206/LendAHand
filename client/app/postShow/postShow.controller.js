'use strict';

angular.module('codeApp')
  .controller('PostShowCtrl', function ($scope,$http,$stateParams,Auth,$location) {
    var loadPosts = function(){
      $http.get('/api/posts/' + $stateParams.id).success(function(post) {
        $scope.post = post;
      });
    };
    loadPosts();
    $scope.newComment = {};
    $scope.submitComment = function() {
    $http.post('/api/posts/' + $stateParams.id + '/comments', $scope.newComment).success(function(){
      loadPosts();
      $scope.newComment = {};
    });
  };

  $scope.deletePost = function() {
       $http.delete('/api/posts/' + $stateParams.id).success(function(){
         $location.path('/');
       });
     };
     $scope.deleteComment = function(comment) {
       $http.delete('/api/posts/' + $stateParams.id + '/comments/' + comment._id).success(function(){
         loadPosts();
       });
     };
     $scope.updatePost = function() {
       $http.put('/api/posts/' + $stateParams.id, $scope.post).success(function(){
         loadPosts();
       });
     };
     $scope.updateComment = function(comment) {
       $http.put('/api/posts/' + $stateParams.id + '/comments/' + comment._id, comment).success(function(){
         loadPosts();
       });
     };
     $scope.isOwner = function(obj){
       return Auth.isLoggedIn() && obj && obj.user && obj.user._id === Auth.getCurrentUser()._id;
     };
     $scope.isLike = function(obj){
     return Auth.isLoggedIn() && obj && obj.likes && obj.likes.indexOf(Auth.getCurrentUser()._id)!==-1;
   };
   $scope.like = function(subpath) {
     $http.put('/api/posts/' + $scope.post._id + subpath + '/like').success(function(){
       loadPosts();
     });
   };
   $scope.unlike = function(subpath) {
     $http.delete('/api/posts/' + $scope.post._id + subpath + '/like').success(function(){
       loadPosts();
     });
   };


  });
