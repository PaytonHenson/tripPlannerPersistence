var dayRouter = require('express').Router();
var Day = require('../../models/day');

dayRouter.get('/api/days', function (req, res, next) {
  Day.findAll({})
  .then(function (days) {
    res.json(days);
  });
});

dayRouter.get('/api/days/:dayID', function (req, res, next) {
  res.send(req.params.num);
});

dayRouter.post('/api/newDay', function (req, res, next) {
  Day.create({number: req.body.number})
  .then(function (day) {
    res.send(day);
  });
});

dayRouter.delete('/api/rmvDay', function (req, res, next) {

});

dayRouter.post('/api/days/:dayID/restaurants', function (req, res, next) {

});

dayRouter.post('/api/days/:dayID/activities', function (req, res, next) {

});

dayRouter.post('/api/days/:dayID/hotels', function (req, res, next) {

});

dayRouter.delete('/api/days/:dayID/restaurants', function (req, res, next) {

});

dayRouter.delete('/api/days/:dayID/activities', function (req, res, next) {

});

dayRouter.delete('/api/days/:dayID/hotels', function (req, res, next) {

});

module.exports = dayRouter;
