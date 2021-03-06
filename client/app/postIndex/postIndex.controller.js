'use strict';

angular.module('codeApp')
  .controller('PostIndexCtrl', function ($scope,$http, $location,Auth,query, $modal,$document, $log) {
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

    $scope.isReport = function(obj){
    return Auth.isLoggedIn() && obj && obj.reports && obj.reports.indexOf(Auth.getCurrentUser()._id)!==-1;
  };

  $scope.report = function(obj) {
    $http.put('/api/posts/' + obj._id  + '/report').success(function(){
      loadPosts();
      alert('Post Reported!');
      if(obj.reports.length > 0){
        //Posts.destroy(obj);
      }
    });
  };
  $scope.unreport = function(obj) {
    $http.delete('/api/posts/' + obj._id  + '/report').success(function(){
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
//   $scope.sharePost = function(obj) {
//     var data = ({
//       fromUser: Auth.getCurrentUser(),
//       toEmail: '',//this.shareEmail,
//       sharedPost: obj,
//     });
// console.log('LOLOLOLOL');
//     $http.post('/api/posts/share',data).success(function(){
//     loadPosts();
//     });
//   };

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
        alert('Recommendation Sent!');
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

  });
