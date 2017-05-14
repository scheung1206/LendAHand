# Getting Started (Must install these and versions described before running the application)

- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- Angular - npm angular ^1.40
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod` (Latest version of MongoDB)

#Build and Development

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate  terminal shell to keep an instance of the MongoDB Daemon

4. Run 'grunt build' to build the css

5. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.
