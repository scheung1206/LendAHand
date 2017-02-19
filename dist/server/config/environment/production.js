'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://test:test123@ds053206.mlab.com:53206/heroku_8kqdbk2s',
    options: {
      user: 'test',
      pass: 'test123'
    }
  }
};
// uri:  process.env.MONGOLAB_URI ||
//       process.env.MONGOHQ_URL ||
//       process.env.OPENSHIFT_MONGODB_DB_URL +
//       process.env.OPENSHIFT_APP_NAME ||
//       'mongodb://localhost/code'
//# sourceMappingURL=production.js.map
