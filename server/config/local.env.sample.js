'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'code-secret',

  FACEBOOK_ID:      'app-id',
  FACEBOOK_SECRET:  'secret',

    // MongoDB connection options
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://test:test123@ds053206.mlab.com:53206/heroku_8kqdbk2s',
    options: {
      user: 'test',
      pass: 'test123'
    },

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
