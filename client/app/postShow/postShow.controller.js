'use strict';

angular.module('codeApp')
  .controller('PostShowCtrl', function ($scope,$http,$stateParams,Auth,$location, $modal,$document, $log) {
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
   $scope.isReport = function(obj){
      return Auth.isLoggedIn() && obj && obj.reports && obj.reports.indexOf(Auth.getCurrentUser()._id)!==-1;
    };
    $scope.report = function(subpath) {
      $http.put('/api/posts/' + $scope.post._id + subpath + '/report').success(function(){
        if (subpath == '')
        {
          alert('Post Reported!');
        }
        else {
          alert('Comment Reported!');
        }
        loadPosts();
      });
    };
    $scope.unreport = function(subpath) {
      $http.delete('/api/posts/' + $scope.post._id + subpath + '/report').success(function(){
        loadPosts();
      });
    };
    $scope.commentScroll = function(obj) {
      $http.get('/posts/show/' + obj._id).success(function(){
        $location.path('/posts/show/' + obj._id);
      });
    };
    $scope.reportMail = function(obj) {
      var data = ({
        fromUser: Auth.getCurrentUser(),
        //toEmail: this.shareEmail,
        reportedPost: obj,
      });
      $http.post('/api/posts/send',data).success(function(){
      });
    };

    $scope.reportCommentMail = function(post,comment) {
      var data = ({
        fromUser: Auth.getCurrentUser(),
        //toEmail: this.shareEmail,
        reportedPost: post,
        reportedComment: comment,
      });
      $http.post('/api/posts/reportComment',data).success(function(){
      });
    };

    $scope.newCommentMail = function(post,comment) {
      console.log(post.user);
      var data = ({
        fromUser: Auth.getCurrentUser(),
        //toEmail: this.shareEmail,
        thePost: post,
        theComment: comment,
      });
      $http.post('/api/posts/newComment',data).success(function(){
      });
    };

    $scope.postMessage = function(obj)
    {
      //var graph = require('fbgraph');
      console.log('accessToken');
      console.log(Auth.getToken());
      //$http.get('https://graph.facebook.com/me/friends?access_token=' + Auth.getToken());
      // $http.get('/chat/' + obj._id).success(function(){
      //   $location.path('/chat/' + obj._id,obj);
      // });
    };
    //Accept Servicer
    $scope.acceptServicer = function(user)
    {
      if (confirm('Accept ' + user.name + ' as servicer?'))
      {
      $http.post('/api/posts/' + $stateParams.id + '/accept/', user).success(function(){
          loadPosts();
        });
      // console.log(post);
      // console.log(user);
      }
    };
    //Complete Service
    $scope.serviceComplete = function()
    {
      if (confirm('Service is complete?'))
      {
      $http.post('/api/posts/' + $stateParams.id + '/complete/').success(function(){
          loadPosts();
        });
      }
    };

    $scope.servicerRemove = function(user)
    {
      if (confirm('Remove ' + user.name + ' as servicer?'))
      {
      $http.post('/api/posts/' + $stateParams.id + '/remove/').success(function(){
          loadPosts();
        });
      }
    };

    $scope.shareModal = function (size, selectedPost) {
      console.log('LOLOLOLOL');
     //var parentElem = selectedPost ?
       //angular.element($document[0].querySelector('.modal-demo ' + selectedPost)) : undefined;
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      // ariaLabelledBy: 'modal-title',
      // ariaDescribedBy: 'modal-body',
      templateUrl: 'app/sharePost.html',
      controller: function ($scope, $modalInstance, post){
        $scope.post = post;
        $scope.shareEmail = 'me@example.com';
        $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
        console.log(post);
        $scope.ok = function () {
      $modalInstance.close($scope.post);
        };
        //Share Post by Email
        $scope.sharePost = function(obj) {
          var data = ({
            fromUser: Auth.getCurrentUser(),
            toEmail: this.shareEmail,
            sharedPost: obj,
          });
          $http.post('/api/posts/share',data).success(function(){
          alert('Email Sent!');
          });
        };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
        };
      },
      //controllerAs: '$ctrl',
      size: size,
      //appendTo: parentElem,
      resolve: {
        post: function () {
          return selectedPost;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.reviewModal = function (size, selectedPost) {
  var modalInstance = $modal.open({
    animation: $scope.animationsEnabled,
    templateUrl: 'app/reviewUser.html',
    controller: function ($scope, $modalInstance, post){
      $scope.post = post;
      $scope.ok = function () {
        alert('Review has been sent!');
    $modalInstance.close($scope.post);
      };
      //Share Post by Email
      $scope.submitReview = function() {
        $scope.newReview.post = post;
      $http.post('/api/users/' + post.servicer._id + '/reviews', $scope.newReview).success(function(){
        $scope.newReview = {};
      });
      $http.get('/api/users/' + post.servicer._id).success(function(user) {
        $scope.user = user;
        $scope.auth = Auth.getCurrentUser();
      });

    };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
      };
    },
    //controllerAs: '$ctrl',
    size: size,
    //appendTo: parentElem,
    resolve: {
      post: function () {
        return selectedPost;
      }
    }
  });

  modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
  }, function () {
    $log.info('Modal dismissed at: ' + new Date());
  });
};


  });
