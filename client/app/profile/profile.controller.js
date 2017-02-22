'use strict';

angular.module('codeApp')
  .controller('ProfileCtrl', function ($scope,Auth) {
    $scope.user = Auth.getCurrentUser();
  });
