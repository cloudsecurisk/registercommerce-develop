const config = require('config');
const app = require('./app');
const server = require('./server');

server.start(app, config.get('server.port'));
