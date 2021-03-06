'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'code-secret'
  },

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://test:test123@ds053206.mlab.com:53206/heroku_8kqdbk2s',
    options: {
      user: 'test',
      pass: 'test123'
    },
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || '1849687815268564',
    clientSecret: process.env.FACEBOOK_SECRET || '416348dd909f2a41c7d12f424973033b',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
