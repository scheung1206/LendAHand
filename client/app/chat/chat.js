'use strict';

angular.module('zoomchat')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat/:id',
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatCtrl'
      });
  });
