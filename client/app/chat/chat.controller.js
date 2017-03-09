'use strict';

<<<<<<< HEAD
angular.module("zoomchat", ["firebase"]);
  .controller('ChatCtrl',  ['$scope','$firebaseArray',
                function($scope, $firebaseArray) {
                    var url = "https://lendachat-aeca6.firebaseio.com/"
                    var keys = "tt";
                    var res = url.concat(keys);
                    
                    var messages = new Firebase(res);
                    $scope.messages = $firebaseArray(messages);

                    $scope.newMessage = {from:"Me",message:""};

                    $scope.sendMessage = function () {
                        console.log("GOT IT!")
                        $(document).ready(function(){
                            $('#messagewindow').animate({
                            scrollTop: $('#messagewindow')[0].scrollHeight}, 500);
                        });
                        
                        
                        $scope.messages.$add($scope.newMessage);
                        $('#message').val("");
                    }
=======
angular.module('codeApp')
  .controller('ChatCtrl', function ($scope,$stateParams,Auth,$http) {
    $http.get('/api/posts/' + $stateParams.id).success(function(post) {
    $scope.post = post;
    $scope.user = Auth.getCurrentUser();
  });
>>>>>>> master
  });
