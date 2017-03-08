'use strict';

angular.module('codeApp')
  .controller('ProfileCtrl', function ($http,$scope,Auth,$stateParams, $modal, $log) {
    //$scope.user = $stateParams.id//Auth.getCurrentUser();
    $http.get('/api/users/' + $stateParams.id).success(function(user) {
      $scope.user = user;
      $scope.auth = Auth.getCurrentUser();
    });


    // $scope.updateUser = function(){
    //   $http.put('/api/users/' + $stateParams.id, $scope.user).success(function(){
    //     //console.log('Update CLIENT CONTROLLER');//loadPosts();
    //   });
    // }

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


  });
