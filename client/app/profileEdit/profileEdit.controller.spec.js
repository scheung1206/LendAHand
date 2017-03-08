'use strict';

describe('Controller: ProfileEditCtrl', function () {

  // load the controller's module
  beforeEach(module('codeApp'));

  var ProfileEditCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfileEditCtrl = $controller('ProfileEditCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
