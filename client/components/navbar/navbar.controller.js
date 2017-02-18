'use strict';

class NavbarController {
  //start-non-standard
  // menu = [{
  //   'title': 'Home',
  //   'state': 'main'
  // }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, $state) {
    this.search = function(keyword) {
      $state.go('main', {keyword: keyword}, {reload: true});
    };
    this.menu = [
        {
          'title': 'All',
          'link': function(){return '/';},
          'show': function(){return true;},
        },
        {
          'title': 'Mine',
          'link': function(){return '/users/' + Auth.getCurrentUser()._id;},
          'show': Auth.isLoggedIn,
        },
        {
          'title': 'Liked',
          'link': function(){return '/users/' + Auth.getCurrentUser()._id + '/liked';},
          'show': Auth.isLoggedIn,
        },
        { 'title': 'Profile',
          'link': function(){return '/users/' + Auth.getCurrentUser()._id + '/starred';},
          'show': Auth.isLoggedIn,
        },
      ];
      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('codeApp')
  .controller('NavbarController', NavbarController);
