/**
 * Main application file
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _configEnvironment = require('./config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

// Connect to MongoDB

_mongoose2['default'].Promise = require('bluebird');
_mongoose2['default'].connect(_configEnvironment2['default'].mongo.uri, _configEnvironment2['default'].mongo.options);
_mongoose2['default'].connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (_configEnvironment2['default'].seedDB) {
  require('./config/seed');
}

// Setup server
var app = (0, _express2['default'])();
var server = _http2['default'].createServer(app);
// //Adding stuff for socketio chatroom
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

//server.listen(process.env.PORT || 9000);
console.log('Server running....');

// app.get('/', function(req, res){
// 	res.sendFile(__dirname + '/chat.html');
// });

//SocketIo Configuration
io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  socket.on('disconnect', function (data) {
    //if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  //Send Message
  socket.on('send message', function (data) {
    console.log(data);
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  //New User
  socket.on('new user', function (data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
});

//Previous Code
// var socketio = require('socket.io')(server, {
//   serveClient: config.env !== 'production',
//   path: '/socket.io-client'
// });
// require('./config/socketio')(socketio);

require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(_configEnvironment2['default'].port, _configEnvironment2['default'].ip, function () {
    console.log('Express server listening on %d, in %s mode', _configEnvironment2['default'].port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
//# sourceMappingURL=app.js.map
