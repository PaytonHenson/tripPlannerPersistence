'use strict';
/* global $ utilsModule daysModule attractionsModule */

/**
 * A module for constructing front-end `day` objects, optionally from back-end
 * data, and managing the `attraction`s associated with a day.
 *
 * Day objects contain `attraction` objects. Each day also has a `.$button`
 * with its day number. Days can be drawn or erased via `.show()` and
 * `.hide()`, which updates the UI and causes the day's associated attractions
 * to `.show()` or `.hide()` themselves.
 *
 * This module has one public method: `.create()`, used by `days.js`.
 */

var dayModule = (function () {

  // jQuery selections

  var $dayButtons, $dayTitle;
  $(function () {
    $dayButtons = $('.day-buttons');
    $dayTitle = $('#day-title > span');
  });

  // Day class and setup

  function Day (data) {
    // for brand-new days
    this.number = data.number;
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    // for days based on existing data
    utilsModule.merge(data, this);
    if (this.hotel) this.hotel = attractionsModule.create(this.hotel);
    this.restaurants = this.restaurants.map(attractionsModule.create);
    this.activities = this.activities.map(attractionsModule.create);
    // remainder of constructor
    this.buildButton().showButton();
  }

  // automatic day button handling

  Day.prototype.setNumber = function (num) {
    this.number = num;
    this.$button.text(num);
  };

  Day.prototype.buildButton = function () {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function (){
      this.blur(); // removes focus box from buttons
      daysModule.switchTo(self);
    });
    return this;
  };

  Day.prototype.showButton = function () {
    this.$button.appendTo($dayButtons);
    return this;
  };

  Day.prototype.hideButton = function () {
    console.log("I'm in hiding");
    this.$button.detach(); // detach removes from DOM but not from memory
    return this;
  };

  Day.prototype.show = function () {
    // day UI
    this.$button.addClass('current-day');
    $dayTitle.text('Day ' + this.number);
    // attractions UI
    function show (attraction) { attraction.show(); }
    if (this.hotel) show(this.hotel);
    this.restaurants.forEach(show);
    this.activities.forEach(show);
  };

  Day.prototype.hide = function () {
    // day UI
    this.$button.removeClass('current-day');
    $dayTitle.text('Day not Loaded');
    // attractions UI
    function hide (attraction) { attraction.hide(); }
    if (this.hotel) hide(this.hotel);
    this.restaurants.forEach(hide);
    this.activities.forEach(hide);
  };

  // day updating

  Day.prototype.addAttraction = function (attraction) {
    // adding to the day object
    switch (attraction.type) {
      case 'hotel':
        if (this.hotel) this.hotel.hide();
        this.hotel = attraction;
        $.post('/api/days/' + this.id + '/hotels/' + this.hotel.id);
        break;
      case 'restaurant':
        utilsModule.pushUnique(this.restaurants, attraction);
        $.post('/api/days/' + this.id + '/restaurants/' + this.restaurants[this.restaurants.length-1].id);
        break;
      case 'activity':
        utilsModule.pushUnique(this.activities, attraction);
        $.post('/api/days/' + this.id + '/activities/' + this.activities[this.activities.length-1].id);
        break;
      default: console.error('bad type:', attraction);
    }
    // activating UI
    attraction.show();
  };

  Day.prototype.removeAttraction = function (attraction) {
    // removing from the day object
    switch (attraction.type) {
      case 'hotel':
        $.ajax({
                url: '/api/days/' + this.id + '/hotels/' + this.hotel.id,
                type: 'DELETE'
             });
        this.hotel = null;
        break;
      case 'restaurant':
        utilsModule.remove(this.restaurants, attraction);
         // $.ajax({ url:'/api/days/' + this.id + '/restaurants/' + this.restaurants[this.restaurants.length-1].id);
        break;
      case 'activity':
        utilsModule.remove(this.activities, attraction);
        // $.post('/api/days/' + this.id + '/activities/' + this.activities[this.activities.length-1].id);
        break;
      default: console.error('bad type:', attraction);
    }
    // deactivating UI
    attraction.hide();
  };

  // globally accessible module methods

  var methods = {

    create: function (databaseDay) {
      return new Day(databaseDay);
    }

  };

  return methods;

}());
