'use strict';

angular.module('greenFrontApp')
  .controller('NoiceCtrl', function ($scope, $timeout, HeaderService) {
    HeaderService.view('noice');
    var ref = new Firebase('https://radiant-heat-5119.firebaseio.com/voices');
    var query;

    //Viewin scopet
    $scope.view = '1 hour';
    $scope.items = ['1 hour','1 day','1 week', '1 month'];
    $scope.series = ['Average', 'Peak'];
    $scope.labels = [];
    $scope.data = [];
    $scope.avgExpl = '';
    $scope.peakExpl = '';

    //Oletusnäkymänä viimeisin tunti
    setExplanations(1);
    setData(UTCLastHour(), 30, function(snapshot) {
      createHourData(snapshot);
    });

    //Näkymien valinta
    $scope.onClick = function (selected) {
      if ($scope.view !== selected) {
        $scope.view = selected;
        if (selected === '1 hour') {
          setExplanations(1);
          setData(UTCLastHour(), 30, function(snapshot) {
            createHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setExplanations(2);
          setData(UTCLastDay(), null, function(snapshot) {
            createDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setExplanations(3);
          setData(UTCLastWeek(), null, function(snapshot) {
            createWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setExplanations(4);
          setData(UTCLastMonth(), null, function(snapshot) {
            createMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };   

    //Näkymän chartin datan luonti
    function setData(time, limit, callback) {
      if (limit !== null) {
        query = ref.orderByChild('timestamp').startAt(time).limitToLast(limit);
      }
      else {
        query = ref.orderByChild('timestamp').startAt(time);
      }
      query.on('value', function(snapshot) {
        $timeout(function(){
          emptyScopes();
          callback(snapshot);
        });
      });
    }

  // Datan createejat charteille
  function createHourData(snapshot) {
    var loudest = [];
    var avg = [];
    snapshot.forEach(function(item) {
      loudest.push(item.val()['loudest']);
      avg.push(item.val()['average']);
      createMinuteLabels(item);
    });
    updateData(avg,loudest);
  }

  function createMonthData(data) {
    var avg = [];
    var loudest = [];
    data.forEach(function(day) {
      var obj = avgCountPeak(day);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        loudest.push(obj['loudest']);
        createMonthLabels(day[0]);
      }
    });
    updateData(avg,loudest); 
  }

  function createDayData(data) {
    var avg = [];
    var loudest = [];
    data.forEach(function(hour) {
      var obj = avgCountPeak(hour);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        loudest.push(obj['loudest']);
        createHourlyLabels(hour[0]);
      }
    }); 
    updateData(avg,loudest);  
  }

  function createWeekData(data) {
    var avg = [];
    var loudest = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = avgCountPeak(item);
        if (obj['count'] > 0) {
          avg.push(obj['average']);
          loudest.push(obj['loudest']);
          createDailyLabels(item[0]);
        }
      });
    });
    updateData(avg,loudest);
  }

// Label-convertterit

  function createMonthLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.labels.push(moreLessTen(d.getDate())+'.'+moreLessTen(d.getMonth())+'.');
  }

  function createHourlyLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.labels.push(moreLessTen(d.getHours())+':00');
  }

  function createMinuteLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.labels.push(moreLessTen(d.getHours())+':'+moreLessTen(d.getMinutes()));
  }

  function createDailyLabels(item) {
    var pre = '';
    var day = new Date(item.val()['timestamp']).getDay();
    if (day === 0) {
      pre = 'Sun. ';
    }
    else if (day === 1) {
      pre = 'Mon. ';
    }
    else if (day === 2) {
      pre = 'Tue. ';
    }
    else if (day === 3) {
      pre = 'Wed. ';
    }
    else if (day === 4) {
      pre = 'Thu. ';
    }
    else if (day === 5) {
      pre = 'Fri. ';
    }
    else {
      pre = 'Sat. ';
    }
    if (new Date(item.val()['timestamp']).getHours() < 6) {
      $scope.labels.push(pre+'3am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 6 && new Date(item.val()['timestamp']).getHours() < 12) {
      $scope.labels.push(pre+'9am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 12 && new Date(item.val()['timestamp']).getHours() < 18) {
      $scope.labels.push(pre+'3pm');
    }
    else {
      $scope.labels.push(pre+'9pm');
    }
  }

// UTC millisekunti-convertterit

  function UTCLastMonth() {
    var date = new Date();
    var month = 1000*60*60*24*29;
    return new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime() - month;
  }

  function UTCLastWeek() {
    var date = new Date();
    var week = 1000*60*60*24*6;
    return new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime() - week;
  }

  function UTCLastDay() {
    var date = new Date();
    return new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
  }

  function UTCLastHour() {
    var date = new Date();
    var hour = 1000*60*60;
    return new Date().getTime() - hour;
  }


// apumetodit

  function avgCountPeak(data) {
    var average = 0;
    var count = 0;
    var peak = 0;
    data.forEach(function(item) {
      average += parseFloat(item.val()['average']);
      if (peak < parseInt(item.val()['loudest'])) {
          peak = parseInt(item.val()['loudest']);
        }
      count++;
    })
    var obj = {
      'average': (average/count).toFixed(2),
      'loudest': peak,
      'count': count
    }
    return obj;
  }

  function fullDayInHours(snapshot) {
    var data = [];
    for (var i=0; i<24; i++) {
      data[i] = [];
    }
    snapshot.forEach(function(item) {
      data[new Date(item.val()['timestamp']).getHours()].push(item);
    });
    return data;
  }

  function fullMonthInDays(snapshot) {
    var data = [];
    for (var i=0; i<30; i++) {
      data[i] = [];
    }
    var date = null;
    var day = 0;
    snapshot.forEach(function(item) {
      if (date === null) {
        date = new Date(item.val()['timestamp']).getDate();
      }
      if (date !== new Date(item.val()['timestamp']).getDate()) {
        date = new Date(item.val()['timestamp']).getDate();
        day++;
      }
      data[day].push(item);
    });
    return data;
  }

  function fullWeekInParts(snapshot) {
    var data = [];
    for (var i=0; i<7; i++) {
      data[i] = [];
      for (var a=0; a<4; a++) {
        data[i][a] = [];
      }
    }
    var date = null;
    var day = 0;
    snapshot.forEach(function(item) {
      if (date === null) {
        date = new Date(item.val()['timestamp']).getDate();
      }
      if (date !== new Date(item.val()['timestamp']).getDate()) {
        date = new Date(item.val()['timestamp']).getDate();
        day++;
      }
      if (new Date(item.val()['timestamp']).getHours() >= 0 && new Date(item.val()['timestamp']).getHours() < 6) {
        data[day][0].push(item);
      }
      else if (new Date(item.val()['timestamp']).getHours() >= 6 && new Date(item.val()['timestamp']).getHours() < 12) {
        data[day][1].push(item);
      }
      else if (new Date(item.val()['timestamp']).getHours() >= 12 && new Date(item.val()['timestamp']).getHours() < 18) {
        data[day][2].push(item);
      }
      else {
        data[day][3].push(item);
      }
    });
    return data;
  } 

  function emptyScopes() {
    $scope.data = [];
    $scope.labels = [];
  }

  function updateData(avg, loudest) {
    $scope.data.push(avg);
    $scope.data.push(loudest);
  }

  function moreLessTen(val) {
    if (val < 10) {
      return '0'+val;
    }
    else {
      return val;
    }
  }

  function setExplanations(val) {
    if (val === 1) {
      $scope.avgExpl = 'is the average noice calculated from the outputs of the 0.5 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.peakExpl = 'is the highest single output received from the 0.5 second loops over the 2 minutes of time.'; 
    }
    else if (val === 2) {
      $scope.avgExpl = 'is the average noice calculated from the outputs of the 0.5 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.peakExpl = 'is the highest single output received from the 0.5 second loops over the 1 hour of time.';
    }
    else if (val === 3) {
      $scope.avgExpl = 'is the average noice calculated from the outputs of the 0.5 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.peakExpl = 'is the highest single output received from the 0.5 second loops over the 6 hours of time.';
    }
    else if (val === 4) {
      $scope.avgExpl = 'is the average noice calculated from the outputs of the 0.5 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.peakExpl = 'is the highest single output received from the 0.5 second loops over the 1 day of time.';
    }
  }
});