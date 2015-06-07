'use strict';

angular.module('greenFrontApp')
  .controller('AirCtrl', function ($scope, $timeout, HeaderService) {
    HeaderService.view('air');
    //Firebase
    var tempRef = new Firebase('https://radiant-heat-5119.firebaseio.com/temperatures');
    var tempQuery;
    var humidRef = new Firebase('https://radiant-heat-5119.firebaseio.com/humidities');
    var humidQuery;
    //Viewin scopet
    $scope.items = ['1 hour','1 day','1 week', '1 month'];
    $scope.tempview = '1 hour';
    $scope.humidview = '1 hour';
    //-----
    $scope.templabels = [];
    $scope.tempseries = ['Average (℃)', 'Min (℃)', 'Max (℃)'];
    $scope.tempdata = [];
    //-----
    $scope.humidlabels = [];
    $scope.humidseries = ['Average (%)', 'Min (%)', 'Max (%)'];
    $scope.humiddata = [];

    //Oletusnäkymänä viimeisin tunti
    setTempExplanations(1);
    setTempData(UTCLastHour(), 30, function(snapshot) {
      createTempHourData(snapshot);
    });
    setHumidExplanations(1);
    setHumidData(UTCLastHour(), 30, function(snapshot) {
      createHumidHourData(snapshot);
    });
  
    // Näkymien valintafunktiot
    $scope.onTempClick = function (selected) {
      if ($scope.view !== selected) {
        $scope.tempview = selected;
        if (selected === '1 hour') {
          setTempExplanations(1);
          setTempData(UTCLastHour(), 30, function(snapshot) {
            createTempHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setTempExplanations(2);
          setTempData(UTCLastDay(), null, function(snapshot) {
            createTempDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setTempExplanations(3);
          setTempData(UTCLastWeek(), null, function(snapshot) {
            createTempWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setTempExplanations(4);
          setTempData(UTCLastMonth(), null, function(snapshot) {
            createTempMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };  

    $scope.onHumidClick = function (selected) {
      if ($scope.humidview !== selected) {
        $scope.humidview = selected;
        if (selected === '1 hour') {
          setHumidExplanations(1);
          setHumidData(UTCLastHour(), 30, function(snapshot) {
            createHumidHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setHumidExplanations(2);
          setHumidData(UTCLastDay(), null, function(snapshot) {
            createHumidDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setHumidExplanations(3);
          setHumidData(UTCLastWeek(), null, function(snapshot) {
            createHumidWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setHumidExplanations(4);
          setHumidData(UTCLastMonth(), null, function(snapshot) {
            createHumidMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };  

    //Näkymän chartin datan luonti
    function setTempData(time, limit, callback) {
      if (limit !== null) {
        tempQuery = tempRef.orderByChild('timestamp').startAt(time).limitToLast(limit);
      }
      else {
        tempQuery = tempRef.orderByChild('timestamp').startAt(time);
      }
      tempQuery.on('value', function(snapshot) {
        $timeout(function(){
          emptyTempScopes();
          callback(snapshot);
        });
      });
    }

    function setHumidData(time, limit, callback) {
      if (limit !== null) {
        humidQuery = humidRef.orderByChild('timestamp').startAt(time).limitToLast(limit);
      }
      else {
        humidQuery = humidRef.orderByChild('timestamp').startAt(time);
      }
      humidQuery.on('value', function(snapshot) {
        $timeout(function(){
          emptyHumidScopes();
          callback(snapshot);
        });
      });
    }

  // Datan createejat charteille
  function createTempHourData(snapshot) {
    var avg = [];
    var min = [];
    var max = [];
    snapshot.forEach(function(item) {
      min.push(item.val()['min']);
      max.push(item.val()['max']);
      avg.push(item.val()['average']);
      createTempMinuteLabels(item);
    });
    updateTempData(avg,min,max);
  }

  function createTempMonthData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      var obj = avgCountMinMax(day);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        max.push(obj['max']);
        min.push(obj['min']);
        createTempMonthLabels(day[0]);
      }
    });
    updateTempData(avg,min,max); 
  }

  function createTempDayData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(hour) {
      var obj = avgCountMinMax(hour);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        max.push(obj['max']);
        min.push(obj['min']);
        createTempHourlyLabels(hour[0]);
      }
    }); 
    updateTempData(avg,min,max);  
  }

  function createTempWeekData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = avgCountMinMax(item);
        if (obj['count'] > 0) {
          avg.push(obj['average']);
          max.push(obj['max']);
          min.push(obj['min']);
          createTempDailyLabels(item[0]);
        }
      });
    });
    updateTempData(avg,min,max);
  }

  function createHumidHourData(snapshot) {
    var val = [];
    snapshot.forEach(function(item) {
      val.push(item.val()['average']);
      createHumidMinuteLabels(item);
    });
    updateHumidData(val,null,null);
  }

  function createHumidMonthData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      var obj = avgCountMinMax(day);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        max.push(obj['max']);
        min.push(obj['min']);
        createHumidMonthLabels(day[0]);
      }
    });
    updateHumidData(avg,min,max); 
  }

  function createHumidDayData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(hour) {
      var obj = avgCountMinMax(hour);
      if (obj['count'] > 0) {
        avg.push(obj['average']);
        max.push(obj['max']);
        min.push(obj['min']);
        createHumidHourlyLabels(hour[0]);
      }
    }); 
    updateHumidData(avg,min,max);  
  }

  function createHumidWeekData(data) {
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = avgCountMinMax(item);
        if (obj['count'] > 0) {
          console.log(obj);
          avg.push(obj['average']);
          max.push(obj['max']);
          min.push(obj['min']);
          createHumidDailyLabels(item[0]);
        }
      });
    });
    updateHumidData(avg,min,max);
  }

  // Label-convertterit

  function createTempMonthLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.templabels.push(moreLessTen(d.getDate())+'.'+moreLessTen(d.getMonth())+'.');
  }

  function createTempHourlyLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.templabels.push(moreLessTen(d.getHours())+':00');
  }

  function createTempMinuteLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.templabels.push(moreLessTen(d.getHours())+':'+moreLessTen(d.getMinutes()));
  }

  function createTempDailyLabels(item) {
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
      $scope.templabels.push(pre+'3am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 6 && new Date(item.val()['timestamp']).getHours() < 12) {
      $scope.templabels.push(pre+'9am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 12 && new Date(item.val()['timestamp']).getHours() < 18) {
      $scope.templabels.push(pre+'3pm');
    }
    else {
      $scope.templabels.push(pre+'9pm');
    }
  }

  function createHumidMonthLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.humidlabels.push(moreLessTen(d.getDate())+'.'+moreLessTen(d.getMonth())+'.');
  }

  function createHumidHourlyLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.humidlabels.push(moreLessTen(d.getHours())+':00');
  }

  function createHumidMinuteLabels(item) {
    var d = new Date(item.val()['timestamp']);
    $scope.humidlabels.push(moreLessTen(d.getHours())+':'+moreLessTen(d.getMinutes()));
  }

  function createHumidDailyLabels(item) {
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
      $scope.humidlabels.push(pre+'3am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 6 && new Date(item.val()['timestamp']).getHours() < 12) {
      $scope.humidlabels.push(pre+'9am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 12 && new Date(item.val()['timestamp']).getHours() < 18) {
      $scope.humidlabels.push(pre+'3pm');
    }
    else {
      $scope.humidlabels.push(pre+'9pm');
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

  function avgCountMinMax(data) {
    var average = 0;
    var count = 0;
    var min = null;
    var max = null;
    data.forEach(function(item) {
      average += parseFloat(item.val()['average']);
      if (max === null || max < parseFloat(item.val()['max'])) {
          max = parseFloat(item.val()['max']);
      }
      if (min === null || min > parseFloat(item.val()['min'])) {
          min = parseFloat(item.val()['min']);
      }
      count++;
    })
    var obj = {
      'average': (average/count).toFixed(2),
      'max': max,
      'min': min,
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

  function emptyTempScopes() {
    $scope.tempdata = [];
    $scope.templabels = [];
  }

  function emptyHumidScopes() {
    $scope.humiddata = [];
    $scope.humidlabels = [];
  }

  function updateTempData(avg, min, max) {
    $scope.tempdata.push(avg);
    $scope.tempdata.push(min);
    $scope.tempdata.push(max);
  }

  function updateHumidData(avg, min, max) {
    if (min === null && max === null) {
      $scope.humidseries = ['Humidity (%)'];
      $scope.humiddata.push(avg);
    }
    else {
      $scope.humidseries = ['Average (%)', 'Min (%)', 'Max (%)'];
      $scope.humiddata.push(avg);
      $scope.humiddata.push(min);
      $scope.humiddata.push(max);
    }
  }

  function moreLessTen(val) {
    if (val < 10) {
      return '0'+val;
    }
    else {
      return val;
    }
  }

  function setTempExplanations(val) {
    if (val === 1) {
      $scope.tempAvgExpl = 'is calculated from the outputs of the 5 second loops over 5 minutes of time. For example 04:43 represents the time between 04:38:00 and 04:42:59.'; 
      $scope.tempMinMaxExpl = 'is the lowest/highest single output received from the 5 second loops over the 5 minutes of time.';
    }
    else if (val === 2) {
      $scope.tempAvgExpl = 'is calculated from the outputs of the 5 second loops over 1 hour of time. For example 04:00 represents the time between 04:00 and 04:59.'; 
      $scope.tempMinMaxExpl = 'is the lowest/highest single output received from the 5 second loops over the 1 hour of time.';
    }
    else if (val === 3) {
      $scope.tempAvgExpl = 'is calculated from the outputs of the 5 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.'; 
      $scope.tempMinMaxExpl = 'is the lowest/highest single output received from the 5 second loops over the 6 hours of time.';
    }
    else if (val === 4) {
      $scope.tempAvgExpl = 'is calculated from the outputs of the 5 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.'; 
      $scope.tempMinMaxExpl = 'is the lowest/highest single output received from the 5 second loops over the 1 day of time.';
    }
  }

  function setHumidExplanations(val) {
    if (val === 1) {
      $scope.visible=false;
      $scope.humidAvgExpl = ''; 
      $scope.humidMinMaxExpl = '';
    }
    else if (val === 2) {
      $scope.visible=true;
      $scope.humidAvgExpl = 'is calculated from the outputs of the 5 minute loops over 1 hour of time. For example 04:00 represents the time between 04:00 and 04:59.'; 
      $scope.humidMinMaxExpl = 'is the lowest/highest single output received from the 5 minute loops over the 1 hour of time.';
    }
    else if (val === 3) {
      $scope.visible=true;
      $scope.humidAvgExpl = 'is calculated from the outputs of the 5 minute loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.'; 
      $scope.humidMinMaxExpl = 'is the lowest/highest single output received from the 5 minute loops over the 6 hours of time.';
    }
    else if (val === 4) {
      $scope.visible=true;
      $scope.humidAvgExpl = 'is calculated from the outputs of the 5 minute loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.'; 
      $scope.humidMinMaxExpl = 'is the lowest/highest single output received from the 5 minute loops over the 1 day of time.';
    }
  }

});