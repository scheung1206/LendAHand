'use strict';

angular.module('codeApp', [
  'codeApp.auth',
  'codeApp.admin',
  'codeApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',

  'ngTagsInput',
  'ui.pagedown',
  'ngMessages',
  'infinite-scroll',

  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
