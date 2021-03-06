var _ = require('lodash');
var wcRouter = require('express').Router();

/*
var displayStatus = {
    availability: "available",
    desireability: "blowed"
};
*/

var updateId = function(req, res, next) {
  if (!req.body.id) {
    id++;
    req.body.id = id + '';
  }
  next();
};

wcRouter.param('id', function(req, res, next, id) {
  var lion = _.find(lions, {id: id})

  if (lion) {
    req.lion = lion;
    next();
  } else {
    res.send();
  }
});

wcRouter.get('/', function(req, res){
console.log("get called");
  res.json(displayStatus);
});

wcRouter.get('/:id', function(req, res){
  var lion = req.lion;
  res.json(lion || {});
});

wcRouter.post('/', updateId, function(req, res) {
  var lion = req.body;

  lions.push(lion);

  res.json(lion);
});

wcRouter.delete('/:id', function(req, res) {
  var lion = _.findIndex(lions, {id: req.params.id});
  lions.splice(lion, 1);

  res.json(req.lion);
});

wcRouter.put('/:id', function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id
  }

  var lion = _.findIndex(lions, {id: req.params.id});
  if (!lions[lion]) {
    res.send();
  } else {
    var updatedLion = _.assign(lions[lion], update);
    res.json(updatedLion);
  }
});

module.exports = wcRouter;
