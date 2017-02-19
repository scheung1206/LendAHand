'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://test:test123@ds053206.mlab.com:53206/heroku_8kqdbk2s',
    options: {
      user: 'test',
      pass: 'test123'
  };
//   sequelize: {
//     options: {
//       logging: false,
//       storage: 'test.sqlite',
//       define: {
//         timestamps: false
//       }
//     }
//   }
// };
