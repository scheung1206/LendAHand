'use strict';

describe('Controller: ProfileViewCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

  var ProfileViewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfileViewCtrl = $controller('ProfileViewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
