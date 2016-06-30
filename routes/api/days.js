var dayRouter = require('express').Router();
var Day = require('../../models/day');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Promise = require('bluebird');

dayRouter.get('/api/days', function (req, res, next) {
  Day.findAll({})
  .then(function (days) {
    res.json(days);
  });
});

dayRouter.get('/api/days/:dayID', function (req, res, next) {
  res.send(req.params.num);
});

dayRouter.get('/api/numDays', function (req, res, next) {
  Day.count()
    .then(function (num) {
      res.json(num);
    });
})

dayRouter.post('/api/newDay', function (req, res, next) {
  Day.create({number: req.body.number})
  .then(function (day) {
    res.send(day);
  });
});

dayRouter.post('/api/days', function (req, res, next) {
  Day.findAll({})
  .then(function (days) {
    var count = 1;
    days.forEach(function (e, i) {
      e.update({number: count});
      count++;
    })
    res.sendStatus(206);
  });
});

dayRouter.delete('/api/rmvDay/:id', function (req, res, next) {
  Day.destroy({where: {
    id: req.params.id
    }
  }).then(function () {
    res.sendStatus(204);
  })
});

dayRouter.post('/api/days/:dayId/restaurants/:restaurantId', function (req, res, next) {
  var foundDay = Day.findById(req.params.dayId)

  var foundRestaurant = Restaurant.findById(req.params.restaurantId);

  Promise.all([foundDay, foundRestaurant])
    .spread(function (foundDay, foundRestaurant) {
      foundDay.addRestaurant(foundRestaurant);
    })
});

dayRouter.post('/api/days/:dayId/activities/:activityId', function (req, res, next) {
  var foundDay = Day.findById(req.params.dayId)

  var foundActivity = Activity.findById(req.params.activityId);

  Promise.all([foundDay, foundActivity])
    .spread(function (foundDay, foundActivity) {
      foundDay.addActivity(foundActivity);
    })

});

dayRouter.post('/api/days/:dayId/hotels/:hotelId', function (req, res, next) {
  var foundDay = Day.findById(req.params.dayId)

  var foundHotel = Hotel.findById(req.params.hotelId);

  Promise.all([foundDay, foundHotel])
    .spread(function (foundDay, foundHotel) {
      foundDay.setHotel(foundHotel);
    })

});

dayRouter.delete('/api/days/:dayId/restaurants/:restaurantId', function (req, res, next) {


});

dayRouter.delete('/api/days/:dayId/activities/:activityId', function (req, res, next) {

});

dayRouter.delete('/api/days/:dayId/hotels/:hotelId', function (req, res, next) {
  Day.findById(req.params.dayId)
    .then(function (day) {
      day.setHotel(null)
    });
});

module.exports = dayRouter;
