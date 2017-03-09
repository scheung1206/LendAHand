'use strict';

angular.module('zoomchat')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        //url: '/chat/:id',
        url: '/chat',
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatCtrl'
      });
  });
