const express = require('express');
const application = express();
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const server = require('http').createServer([], application);
dotenv.config();

app.use(cors());

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Chatao API Works');
});

global.io = require('socket.io').listen(server);
require('./api/sockets/genericMethods')(io);

application.set('port', process.env.PORT);
application.use(app);

server.listen(application.get('port'), () => {
    console.log('Express app listening at http://%s:%s', server.address().address, server.address().port);
});
