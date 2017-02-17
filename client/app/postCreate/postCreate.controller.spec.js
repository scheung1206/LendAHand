'use strict';

describe('Controller: PostCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

  var PostCreateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostCreateCtrl = $controller('PostCreateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
