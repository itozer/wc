var wcRouterSocket = require('express').Router();
//var expressWs = require('express-ws')(wcRouterSocket);

var displayStatus = {
    availability: "available",
    desireability: "blowed"
};

wcRouterSocket.get('/', function(req, res){
console.log("get called");
  res.json(displayStatus);
});

/*
wcRouterSocket.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);

  setInterval(function() {
      ws.send("test");
   }, 2000);

});
*/

module.exports = wcRouterSocket;
