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
    if (this && this.blur) this.blur(); // removes focus box from buttons

    $.get('/api/numDays', function (num) {
      $.post('/api/newDay', {number: num + 1}, function (day) {
          var newDay = dayModule.create(day);
          if (num === 0) {
            currentDay = newDay;
            switchTo(currentDay);
          }
        })
      })

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
      // .then(function () {
      //   $.get('/api/days')
      // })
      .then(function() {
        $.post('/api/days', methods.load)
      })
  }

  // globally accessible module methods

  var methods = {

    load: function () {
      $.ajax({
        method: 'GET',
        url: '/api/days',
        success: function (days) {
          var daysArr = days.map(dayModule.create);
          switchTo(daysArr[0]);
        },
        error: function (err) {
          console.error(err);
        }
      });
      // $(addDay);
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
