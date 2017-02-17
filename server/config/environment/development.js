'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://test:test123@ds053206.mlab.com:53206/heroku_8kqdbk2s',
    options: {
      user: 'test',
      pass: 'test123'
    },
  },

  // Seed database on startup
  seedDB: false

};
