var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
var morgan = require('morgan');
var wcRouter = require('./wc');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(morgan('dev'))
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// this is called mounting. when ever a req comes in for
// '/lion' we want to use this router
app.use('/wc', wcRouter);


/*app.get('/', function(req, res) {
    //res.sendFile(__dirname + '/../client/index.html');
    res.sendFile('/home/isaac/development/wc/wc_node/client/index.html');
});*/


io.on('connection', function(socket) {
    io.emit('status', wcRouter.displayStatus);

    socket.on('user action', function(msg) {
        console.log('user action: ' + msg);
    });
});


app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});




app.listen(3000);
console.log('on port 3000');
