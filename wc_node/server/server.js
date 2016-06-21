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
app.use('/wc', wcRouter);

/*
app.get('/', function(req, res) {
    //res.sendFile(__dirname + '/../client/index.html');
    res.sendFile('/home/isaac/development/wc/wc_node/client/index.html');
});
*/

var wc = {
    bathrooms: {
        b1 : {
            id: "bathroom-1",
            gender: "male",
            availability: "available",
            desireability: "blowed",
            stats: {}
        },
        b2 : {
            id: "bathroom-2",
            gender: "male",
            availability: "occupied",
            desireability: "blowed",
            stats: {}
        },
        b3 : {
            id: "bathroom-3",
            gender: "male",
            availability: "reserved",
            desireability: "blowed",
            stats: {}
        }
    },
    active: ""
}

io.on('connection', function(socket) {
    console.log('connection');
    io.emit('init', JSON.stringify(wc));

    var count = 0;

    setInterval(function() {
        var bathroom = {
            b2 : {
                gender: "male",
                availability: (count++ % 2? "occupied": "available"),
                desireability: "blowed",
                id: "bathroom-2"
            }
        };
console.log("timer emit");
        io.emit('update', JSON.stringify(bathroom));
    }, 30000);


    socket.on('update', function(msg) {
        console.log('update: ' + msg);
    });

    socket.on('action', function(msg) {
        console.log('action: ' + msg);
    });

    socket.on('userMessage', function(msg) {
        console.log('message: ' + msg);
        io.emit('userMessage', msg);
    });

});

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

/*app.listen(3000);*/
http.listen(3000);
console.log('on port 3000');
