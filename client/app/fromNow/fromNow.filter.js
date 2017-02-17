'use strict';

angular.module('codeApp')
  .filter('fromNow', function () {
    return function (input) {
      return moment(input).locale(window.navigator.language).fromNow();
    };
  });
