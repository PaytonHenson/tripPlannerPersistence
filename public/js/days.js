'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var daysModule = (function () {

  // application state
  var days = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  // jQuery event binding

  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay () {
    console.log(days);
    if (this && this.blur) this.blur(); // removes focus box from buttons

    $.get('/api/numDays', function (num) {
      $.post('/api/newDay', {number: num + 1}, function (day) {
          var newDay = dayModule.create(day);
          days.push(newDay);
          console.log(days);
          if (num === 0) {
            currentDay = newDay;
            switchTo(currentDay);
          }
        });
      });

  }

  function deleteCurrentDay () {
    // prevent deleting last day

    $.get('/api/numDays')
      .then(function (num) {
        if (num < 2 || !currentDay) {console.log("But I won't do that. - Meatloaf")}
        else {
          return $.ajax({
          url: '/api/rmvDay/' + currentDay.id,
          type: 'DELETE'
        });
        }
      })
      .then(function() {
        days.forEach(function(e) {
          e.hideButton();
        });
        var idx = days.indexOf(currentDay);
        days.splice(idx, 1);
        return $.post('/api/days');
      })
      .then(function () {
        methods.load();
      });
  }

  // globally accessible module methods

  var methods = {

    load: function () {
      $.ajax({
        method: 'GET',
        url: '/api/days',
        success: function (dbDays) {
          var daysArr = dbDays.map(dayModule.create);
          days = [];
          daysArr.forEach(function (e) {
            days.push(e);
          });
          console.log(days);
          switchTo(daysArr[0]);
        },
        error: function (err) {
          console.error(err);
        }
      });
    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return methods;

}());
