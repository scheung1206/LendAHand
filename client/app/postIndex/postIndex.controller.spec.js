'use strict';

describe('Controller: PostIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

  var PostIndexCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostIndexCtrl = $controller('PostIndexCtrl', {
      $scope: scope,
      query: {},
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
