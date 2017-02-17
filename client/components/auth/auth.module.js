'use strict';

angular.module('codeApp.auth', [
  'codeApp.constants',
  'codeApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
