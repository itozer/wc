var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
var morgan = require('morgan');
var wcRouter = require('./wc');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

app.use(morgan('dev'))
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/wc', wcRouter);


//connect to db
//mongoose.connect('mongodb://localhost/wc');

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
            key: "b1",
            title: "Bathroom 1",
            gender: "male",
            availability: "available",
            //reserved: false,
            desireability: "clean",
            stats: {}
        },
        b2 : {
            id: "bathroom-2",
            key: "b2",
            title: "Bathroom 2",
            gender: "male",
            availability: "occupied",
            //reserved: false,
            desireability: "clean",
            stats: {}
        },
        b3 : {
            id: "bathroom-3",
            key: "b3",
            title: "Bathroom 3",
            gender: "male",
            availability: "reserved",
            //reserved: true,
            desireability: "clean",
            stats: {}
        }
    },
    active: ""
}

    var count = 0;
    setInterval(function() {
        /*var bathroom = {
            id: "bathroom-2",
            key: "b2",
            availability: (count++ % 2? "occupied": "available"),
        };*/
        var bathroom = wc.bathrooms.b2;
        bathroom.availability = (count++ % 2? "occupied": "available"),
        //wc.bathrooms[bathroom.key].availability = bathroom.availability;
console.log("timer emit");
        io.emit('update', JSON.stringify(bathroom), true);
    }, 30000);


io.on('connection', function(socket) {
    console.log('connection');
    io.emit('init', JSON.stringify(wc));

    socket.on('update', function(msg) {
        console.log('update: ' + msg);
    });

    socket.on('action', function(msg) {
        console.log('action: ' + msg);
        var message = JSON.parse(msg);
        switch(message.action) {
            case "blowed-button":
                updateBathroom(message.bId, "desireability", "blowed", function(b) {
                    io.emit('update', JSON.stringify(b));
                    setBlowedCounter(b.id);
                });
                break;
            case "reserved-button":
                updateBathroom(message.bId, "availability", "reserved", function(b) {
                    io.emit('update', JSON.stringify(b));
                    setReservedCounter(b.id);
                });
                break;
            case "alert-button":
                //not sure how i want to handle this yer
                break;
        }
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

function updateBathroom(id, key, value, cb) {
    var bathroom, bKey, bValue;
    for (bathroom in wc.bathrooms) {
        if (wc.bathrooms[bathroom].id === id) {
            wc.bathrooms[bathroom][key] = value;
            bKey = bathroom;
            bValue = wc.bathrooms[bathroom];
            break;
        }
    }
    cb(bValue);
}

function setBlowedCounter(id) {
    var minutes = 10;
    setTimeout(function() {
        updateBathroom(id, "desireability", "clean", function(b) {
            io.emit('update', JSON.stringify(b));
        });
    //}, 1000 * 60 * minutes);
    }, 5000);
}

function setReservedCounter(id) {
    var minutes = 10;
    setTimeout(function() {
        updateBathroom(id, "availability", "available", function(b) {
            io.emit('update', JSON.stringify(b));
        });
    //}, 1000 * 60 * minutes);
    }, 5000);
}
