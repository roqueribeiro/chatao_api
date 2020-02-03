const express = require('express');
const application = express();
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const server = require('http').createServer([], application);
dotenv.config();

app.use(bodyParser.json());
api.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

global.io = require('socket.io').listen(server);
require('./api/sockets/genericMethods')(io);

application.set('port', process.env.PORT);
application.use(app);

server.listen(application.get('port'), function () {
    console.log('Express app listening at http://%s:%s', server.address().address, server.address().port);
});