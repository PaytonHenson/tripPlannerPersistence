var attractionsRouter = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

attractionsRouter.get('/api/hotels', function (req, res, next) {
  Hotel.findAll({})
  .then(function (hotels) {
    res.json(hotels);
  });
});

attractionsRouter.get('/api/restaurants', function (req, res, next) {
  Restaurant.findAll({})
  .then(function (restaurants) {
    res.json(restaurants);
  });
});

attractionsRouter.get('/api/activities', function (req, res, next) {
  Activity.findAll({})
  .then(function (activites) {
    res.json(activites);
  });
});

module.exports = attractionsRouter;
