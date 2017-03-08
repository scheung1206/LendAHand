'use strict';

angular.module('codeApp')
  .controller('ProfileCtrl', function ($http,$scope,Auth,$stateParams, $modal, $log) {
    //$scope.user = $stateParams.id//Auth.getCurrentUser();
    
    $http.get('/api/users/' + $stateParams.id).success(function(user) {
      $scope.user = user;
      $scope.auth = Auth.getCurrentUser();
    });
    
    $scope.newReview = {};


    $scope.editModal = function (size, selectedUser) {
      console.log('LOLOLOLOL');
     //var parentElem = selectedPost ?
       //angular.element($document[0].querySelector('.modal-demo ' + selectedPost)) : undefined;
      var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      // ariaLabelledBy: 'modal-title',
      // ariaDescribedBy: 'modal-body',
      templateUrl: 'app/profile/editProfile.html',
      controller: function ($scope, $modalInstance, user){
        $scope.user = user;

      $scope.ok = function () {
      $modalInstance.close($scope.user);
        };
        $scope.updateUser = function(){
          $http.put('/api/users/' + $stateParams.id, $scope.user).success(function(){
            //console.log('Update CLIENT CONTROLLER');//loadPosts();
          });
        }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
        };
      },
      //controllerAs: '$ctrl',
      size: size,
      //appendTo: parentElem,
      resolve: {
        user: function () {
          return selectedUser;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

     $scope.isOwner = function(obj){
       return Auth.isLoggedIn() && obj && obj.user && obj.user._id === Auth.getCurrentUser()._id;
     };

    //ADD Client side controller && HTML code!!
    $scope.submitReview = function() {
    $http.post('/api/users/' + $stateParams.id + '/reviews', $scope.newReview).success(function(){  
      $scope.newReview = {};
    });
  };

     $scope.deleteReview = function(review) {
     $http.delete('/api/users/' + $stateParams.id + '/reviews/' + review._id).success(function(){
    });
   };

    $scope.updateReview = function(review) {
     $http.put('/api/users/' + $stateParams.id + '/reviews/' + review._id, review).success(function(){
  
     });
   };

    $scope.isLike = function(obj){
     return Auth.isLoggedIn() && obj && obj.likes && obj.likes.indexOf(Auth.getCurrentUser()._id)!==-1;
   };

  });
