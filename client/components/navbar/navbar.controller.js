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
          'expand': function(){return true;}, 
          'link': function(){return '/';},
          'show': function(){return true;},
        },
        {
          'title': 'Mine',
          'expand': function(){return true;}, 
          'link': function(){return '/users/' + Auth.getCurrentUser()._id;},
          'show': Auth.isLoggedIn,
        },
        {

          'title': 'Liked',
          'link': function(){return '/users/' + Auth.getCurrentUser()._id + '/liked';},
          'show': Auth.isLoggedIn,
        },
        { 'title': 'Profile',
          'link': function(){return '/profile';},
          'show': Auth.isLoggedIn,
        },
        { 'title': 'Edit Profile',
          'link': function(){return '/profileEdit';},
          'show': Auth.isLoggedIn,
        },
        {

          'title': 'Chatroom',
          'link': function(){return '/chat';},
          'show': function(){return true;},
        },
      ];
      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('codeApp')
  .controller('NavbarController', NavbarController);
