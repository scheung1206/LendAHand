'use strict';

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
  });
