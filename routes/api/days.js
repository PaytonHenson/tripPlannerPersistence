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
