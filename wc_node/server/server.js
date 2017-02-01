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

//for demo just store state in memory
var wc = {
    bathrooms: {
        b1 : {
            id: "bathroom-1",
            key: "b1",
            title: "Bathroom 1",
            gender: "male",
            availability: "available",
            availabilityTime: Date.now(),
            reservedTime: 0,
            reservedCountdownTime: (30 * 1000),
            blowedTime: 0,
            blowedCountdownTime: (10 * 60 * 1000),
            desireability: "clean",
            stats: {}
        },
        b2 : {
            id: "bathroom-2",
            key: "b2",
            title: "Bathroom 2",
            gender: "female",
            availability: "occupied",
            availabilityTime: Date.now(),
            reservedTime: 0,
            reservedCountdownTime: (30 * 1000),
            blowedTime: 0,
            blowedCountdownTime: (10 * 60 * 1000),
            desireability: "clean",
            stats: {}
        },
        b3 : {
            id: "bathroom-3",
            key: "b3",
            title: "Bathroom 3",
            gender: "male",
            availability: "available",
            availabilityTime: Date.now(),
            reservedTime: 0,
            reservedCountdownTime: (30 * 1000),
            blowedTime: 0,
            blowedCountdownTime: (10 * 60 * 1000),
            desireability: "clean",
            stats: {}
        }
    },
    active: "",
}

init();

function init() {
    //simulate bathroom state change
    setInterval(function() {
        var bathroom = wc.bathrooms["b" + getRandomInt(1,3)];
        if (bathroom.availability === "available") {
            bathroom.availability = "occupied";
        } else {
            bathroom.availability = "available";
            bathroom.availabilityTime = Date.now();
        }
        console.log(bathroom);
        io.emit('update', JSON.stringify(bathroom), true);
    }, 5000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min +1) + min);
}

io.on('connection', function(socket) {
    console.log('connection');
    io.emit('init', JSON.stringify(wc));

    socket.on('update', function(msg) {
        console.log('update: ' + msg);
    });

    socket.on('action', function(msg) {
        var message = JSON.parse(msg);
        var bathroom = message.bathroom;
        console.log('action: ' + msg);
        console.log(message.action);
        switch(message.action) {
            case "blowed-button":
console.log("case blowed");
                updateBathroom(bathroom.id, "desireability", "blowed", function(b) {
                    setBlowedCounter(b);
                    io.emit('update', JSON.stringify(b));
                });
                break;
            case "reserved-button":
console.log("case reserved");
                updateBathroom(bathroom.id, "availability", "reserved", function(b) {
                    setReservedCounter(b);
                    io.emit('update', JSON.stringify(b));
                });
                break;
            case "alert-button":
                //not sure how i want to handle this yet
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
//http.listen(3000);
//console.log('on port 3000');
http.listen(3000);
console.log('on port 3000');

function updateBathroom(id, key, value, cb) {
//console.log("updateBathroom: id=" + id);
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

function setBlowedCounter(bathroom) {
    console.log("setBlowedCounter");
    bathroom.blowedTime = Date.now();
    setTimeout(function() {
        updateBathroom(bathroom.id, "desireability", "clean", function(b) {
            io.emit('update', JSON.stringify(b));
        });
    }, bathroom.blowedCountdownTime);
}

function setReservedCounter(bathroom) {
    console.log("setReservedCounter");
    bathroom.reservedTime = Date.now();
    setTimeout(function() {
        updateBathroom(bathroom.id, "availability", "available", function(b) {
            io.emit('update', JSON.stringify(b));
        });
    }, bathroom.reservedCountdownTime);
}
