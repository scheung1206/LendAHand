/**
 * Main application file
 */

'use strict';
var express = require('express');
//import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
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
io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  	socket.on('disconnect', function(data){
  		//if(!socket.username) return;
  		users.splice(users.indexOf(socket.username), 1);
  		updateUsernames();
  		connections.splice(connections.indexOf(socket), 1);
    	console.log('Disconnected: %s sockets connected', connections.length);
  	});

   //Send Message
    socket.on('send message', function(data){
    	console.log(data);
      io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', function(data, callback){
    	callback(true);
    	socket.username = data;
    	users.push(socket.username);
    	updateUsernames();
    });

    function updateUsernames(){
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
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
