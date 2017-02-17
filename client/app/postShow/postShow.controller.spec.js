'use strict';

describe('Controller: PostShowCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

  var PostShowCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostShowCtrl = $controller('PostShowCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
