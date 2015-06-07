'use strict';

angular.module('greenFrontApp')
  .controller('LightCtrl', function ($scope, $timeout, HeaderService) {
    HeaderService.view('light');
    //Firebase
    var ivRef = new Firebase('https://radiant-heat-5119.firebaseio.com/infraredandvisible');
    var lRef = new Firebase('https://radiant-heat-5119.firebaseio.com/lux');
    //Viewin scopet
    $scope.items = ['1 hour','1 day','1 week', '1 month'];
    $scope.ivview = '1 hour';
    $scope.iview = '1 hour';
    $scope.vview = '1 hour';
    $scope.lview = '1 hour';
    //-----
    $scope.ivlabels = [];
    $scope.ivseries = ['Infrared', 'Visible'];
    $scope.ivdata = [];
    //-----
    $scope.ilabels = [];
    $scope.iseries = ['Average', 'Min', 'Max'];
    $scope.idata = [];
    //-----
    $scope.vlabels = [];
    $scope.vseries = ['Average', 'Min', 'Max'];
    $scope.vdata = [];
    //-----
    $scope.llabels = [];
    $scope.lseries = ['Average (lx)', 'Min (lx)', 'Max (lx)'];
    $scope.ldata = [];

    //Oletusnäkymänä viimeisin tunti
    setIVExplanations(1);
    setIVData(UTCLastHour(), 30, function(snapshot) {
      createIVHourData(snapshot);
    });
    setIExplanations(1);
    setIVData(UTCLastHour(), 30, function(snapshot) {
      createIHourData(snapshot);
    });
    setVExplanations(1);
    setIVData(UTCLastHour(), 30, function(snapshot) {
      createVHourData(snapshot);
    });
    setLExplanations(1);
    setLData(UTCLastHour(), 30, function(snapshot) {
      createLHourData(snapshot);
    });

    // Näkymien valintafunktiot
    $scope.onIVClick = function (selected) {
      if ($scope.view !== selected) {
        $scope.ivview = selected;
        if (selected === '1 hour') {
          setIVExplanations(1);
          setIVData(UTCLastHour(), 30, function(snapshot) {
            createIVHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setIVExplanations(2);
          setIVData(UTCLastDay(), null, function(snapshot) {
            createIVDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setIVExplanations(3);
          setIVData(UTCLastWeek(), null, function(snapshot) {
            createIVWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setIVExplanations(4);
          setIVData(UTCLastMonth(), null, function(snapshot) {
            createIVMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };  

    $scope.onIClick = function (selected) {
      if ($scope.iview !== selected) {
        $scope.iview = selected;
        if (selected === '1 hour') {
          setIExplanations(1);
          setIVData(UTCLastHour(), 30, function(snapshot) {
            createIHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setIExplanations(2);
          setIVData(UTCLastDay(), null, function(snapshot) {
            createIDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setIExplanations(3);
          setIVData(UTCLastWeek(), null, function(snapshot) {
            createIWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setIExplanations(4);
          setIVData(UTCLastMonth(), null, function(snapshot) {
            createIMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };

    $scope.onVClick = function (selected) {
      if ($scope.vview !== selected) {
        $scope.vview = selected;
        if (selected === '1 hour') {
          setVExplanations(1);
          setIVData(UTCLastHour(), 30, function(snapshot) {
            createVHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setVExplanations(2);
          setIVData(UTCLastDay(), null, function(snapshot) {
            createVDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setVExplanations(3);
          setIVData(UTCLastWeek(), null, function(snapshot) {
            createVWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setVExplanations(4);
          setIVData(UTCLastMonth(), null, function(snapshot) {
            createVMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };  

    $scope.onLClick = function (selected) {
      if ($scope.lview !== selected) {
        $scope.lview = selected;
        if (selected === '1 hour') {
          setLExplanations(1);
          setLData(UTCLastHour(), 30, function(snapshot) {
            createLHourData(snapshot);
          });
        }
        if (selected === '1 day') {
          setLExplanations(2);
          setLData(UTCLastDay(), null, function(snapshot) {
            createLDayData(fullDayInHours(snapshot));
          });
        }
        if (selected === '1 week') {
          setLExplanations(3);
          setLData(UTCLastWeek(), null, function(snapshot) {
            createLWeekData(fullWeekInParts(snapshot));
          });
        }
        if (selected === '1 month') {
          setLExplanations(4);
          setLData(UTCLastMonth(), null, function(snapshot) {
            createLMonthData(fullMonthInDays(snapshot));
          });
        }
      }
    };   

    //Näkymän chartin datan luonti
    function setIVData(time, limit, callback) {
      if (limit !== null) {
        var query = ivRef.orderByChild('timestamp').startAt(time).limitToLast(limit);
      }
      else {
        var query = ivRef.orderByChild('timestamp').startAt(time);
      }
      query.on('value', function(snapshot) {
        $timeout(function(){
          callback(snapshot);
        });
      });
    }

    function setLData(time, limit, callback) {
      if (limit !== null) {
        var query = lRef.orderByChild('timestamp').startAt(time).limitToLast(limit);
      }
      else {
        var query = lRef.orderByChild('timestamp').startAt(time);
      }
      query.on('value', function(snapshot) {
        $timeout(function(){
          callback(snapshot);
        });
      });
    }

  // Datan createejat charteille
  function createLHourData(snapshot) {
    emptyLScopes();
    var avg = [];
    var min = [];
    var max = [];
    snapshot.forEach(function(item) {
      avg.push(item.val()['average']);
      min.push(item.val()['min']);
      max.push(item.val()['max']);
      createMinuteLabels(item, function(res) {
        $scope.llabels.push(res);
      });
    });
    updateLData(avg,min,max);
  }

  function createLDayData(data) {
    emptyLScopes();
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(hour) {
      var obj = lCounter(hour);
      if (obj['count'] > 0) {
        avg.push(obj['avg']);
        min.push(obj['min']);
        max.push(obj['max']);
        createHourlyLabels(hour[0], function(res) {
          $scope.llabels.push(res);
        });
      }
    }); 
    updateLData(avg,min,max); 
  }

  function createLWeekData(data) {
    emptyLScopes();
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = lCounter(item);
        if (obj['count'] > 0) {
          avg.push(obj['avg']);
          min.push(obj['min']);
          max.push(obj['max']);
          createDailyLabels(item[0], function(res) {
            $scope.llabels.push(res);
          });
        }
      });
    });
    updateLData(avg,min,max);
  }

  function createLMonthData(data) {
    emptyLScopes();
    var avg = [];
    var min = [];
    var max = [];
    data.forEach(function(day) {
      var obj = lCounter(day);
      if (obj['count'] > 0) {
        avg.push(obj['avg']);
        min.push(obj['min']);
        max.push(obj['max']);
        createMonthLabels(day[0], function(res) {
          $scope.llabels.push(res);
        });
      }
    });
    updateLData(avg,min,max); 
  }

  function createVHourData(snapshot) {
    emptyVScopes();
    var vavg = [];
    var vmin = [];
    var vmax = [];
    snapshot.forEach(function(item) {
      vavg.push(item.val()['visibleAverage']);
      vmin.push(item.val()['visibleMin']);
      vmax.push(item.val()['visibleMax']);
      createMinuteLabels(item, function(res) {
        $scope.vlabels.push(res);
      });
    });
    updateVData(vavg,vmin,vmax);
  }

  function createVDayData(data) {
    emptyVScopes();
    var vavg = [];
    var vmin = [];
    var vmax = [];
    data.forEach(function(hour) {
      var obj = ivCounter(hour);
      if (obj['count'] > 0) {
        vavg.push(obj['vavg']);
        vmin.push(obj['vmin']);
        vmax.push(obj['vmax']);
        createHourlyLabels(hour[0], function(res) {
          $scope.vlabels.push(res);
        });
      }
    }); 
    updateVData(vavg,vmin,vmax);  
  }

  function createVWeekData(data) {
    emptyVScopes();
    var vavg = [];
    var vmin = [];
    var vmax = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = ivCounter(item);
        if (obj['count'] > 0) {
          vavg.push(obj['vavg']);
          vmin.push(obj['vmin']);
          vmax.push(obj['vmax']);
          createDailyLabels(item[0], function(res) {
            $scope.vlabels.push(res);
          });
        }
      });
    });
    updateVData(vavg,vmin,vmax);
  }

  function createVMonthData(data) {
    emptyVScopes();
    var vavg = [];
    var vmin = [];
    var vmax = [];
    data.forEach(function(day) {
      var obj = ivCounter(day);
      if (obj['count'] > 0) {
        vavg.push(obj['vavg']);
        vmin.push(obj['vmin']);
        vmax.push(obj['vmax']);
        createMonthLabels(day[0], function(res) {
          $scope.vlabels.push(res);
        });
      }
    });
    updateVData(vavg,vmin,vmax); 
  }

  function createIHourData(snapshot) {
    emptyIScopes();
    var iavg = [];
    var imin = [];
    var imax = [];
    snapshot.forEach(function(item) {
      iavg.push(item.val()['infraredAverage']);
      imin.push(item.val()['infraredMin']);
      imax.push(item.val()['infraredMax']);
      createMinuteLabels(item, function(res) {
        $scope.ilabels.push(res);
      });
    });
    updateIData(iavg,imin,imax);
  }

  function createIDayData(data) {
    emptyIScopes();
    var iavg = [];
    var imin = [];
    var imax = [];
    data.forEach(function(hour) {
      var obj = ivCounter(hour);
      if (obj['count'] > 0) {
        iavg.push(obj['iavg']);
        imin.push(obj['imin']);
        imax.push(obj['imax']);
        createHourlyLabels(hour[0], function(res) {
          $scope.ilabels.push(res);
        });
      }
    }); 
    updateIData(iavg,imin,imax);  
  }

  function createIWeekData(data) {
    emptyIScopes();
    var iavg = [];
    var imin = [];
    var imax = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = ivCounter(item);
        if (obj['count'] > 0) {
          iavg.push(obj['iavg']);
          imin.push(obj['imin']);
          imax.push(obj['imax']);
          createDailyLabels(item[0], function(res) {
            $scope.ilabels.push(res);
          });
        }
      });
    });
    updateIData(iavg,imin,imax);
  }

  function createIMonthData(data) {
    emptyIScopes();
    var iavg = [];
    var imin = [];
    var imax = [];
    data.forEach(function(day) {
      var obj = ivCounter(day);
      if (obj['count'] > 0) {
        iavg.push(obj['iavg']);
        imin.push(obj['imin']);
        imax.push(obj['imax']);
        createMonthLabels(day[0], function(res) {
          $scope.ilabels.push(res);
        });
      }
    });
    updateIData(iavg,imin,imax); 
  }

  function createIVHourData(snapshot) {
    emptyIVScopes();
    var iavg = [];
    var vavg = [];
    snapshot.forEach(function(item) {
      iavg.push(item.val()['infraredAverage']);
      vavg.push(item.val()['visibleAverage']);
      createMinuteLabels(item, function(res) {
        $scope.ivlabels.push(res);
      });
    });
    updateIVData(iavg,vavg);
  }

  function createIVDayData(data) {
    emptyIVScopes();
    var iavg = [];
    var vavg = [];
    data.forEach(function(hour) {
      var obj = ivCounter(hour);
      if (obj['count'] > 0) {
        iavg.push(obj['iavg']);
        vavg.push(obj['vavg']);
        createHourlyLabels(hour[0], function(res) {
          $scope.ivlabels.push(res);
        });
      }
    }); 
    updateIVData(iavg,vavg);  
  }

  function createIVWeekData(data) {
    emptyIVScopes();
    var iavg = [];
    var vavg = [];
    data.forEach(function(day) {
      day.forEach(function(item) {
        var obj = ivCounter(item);
        if (obj['count'] > 0) {
          iavg.push(obj['iavg']);
          vavg.push(obj['vavg']);
          createDailyLabels(item[0], function(res) {
            $scope.ivlabels.push(res);
          });
        }
      });
    });
    updateIVData(iavg,vavg);
  }

  function createIVMonthData(data) {
    emptyIVScopes();
    var iavg = [];
    var vavg = [];
    data.forEach(function(day) {
      var obj = ivCounter(day);
      if (obj['count'] > 0) {
        iavg.push(obj['iavg']);
        vavg.push(obj['vavg']);
        createMonthLabels(day[0], function(res) {
          $scope.ivlabels.push(res);
        });
      }
    });
    updateIVData(iavg,vavg); 
  }

// Label-convertterit

  function createMonthLabels(item, callback) {
    var d = new Date(item.val()['timestamp']);
    callback(moreLessTen(d.getDate())+'.'+moreLessTen(d.getMonth())+'.');
  }

  function createHourlyLabels(item, callback) {
    var d = new Date(item.val()['timestamp']);
    callback(moreLessTen(d.getHours())+':00');
  }

  function createMinuteLabels(item, callback) {
    var d = new Date(item.val()['timestamp']);
    callback(moreLessTen(d.getHours())+':'+moreLessTen(d.getMinutes()));
  }

  function createDailyLabels(item, callback) {
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
      callback(pre+'3am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 6 && new Date(item.val()['timestamp']).getHours() < 12) {
      callback(pre+'9am');
    }
    else if (new Date(item.val()['timestamp']).getHours() >= 12 && new Date(item.val()['timestamp']).getHours() < 18) {
      callback(pre+'3pm');
    }
    else {
      callback(pre+'9pm');
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

function lCounter(data) {
    var avg = 0;
    var count = 0;
    var min = null;
    var max = null;
    data.forEach(function(item) {
      avg += parseFloat(item.val()['average']);
      if (max === null || max < parseFloat(item.val()['max'])) {
          max = parseFloat(item.val()['max']);
      }
      if (min === null || min > parseFloat(item.val()['min'])) {
          min = parseFloat(item.val()['min']);
      }
      count++;
    })
    var obj = {
      'avg': (avg/count).toFixed(2),
      'count': count,
      'min': min,
      'max': max
    }
    return obj;
  }

  function ivCounter(data) {
    var iavg = 0;
    var vavg = 0;
    var count = 0;
    var imin = null;
    var imax = null;
    var vmin = null;
    var vmax = null;
    data.forEach(function(item) {
      iavg += parseFloat(item.val()['infraredAverage']);
      vavg += parseFloat(item.val()['visibleAverage']);
      if (imax === null || imax < parseFloat(item.val()['infraredMax'])) {
          imax = parseFloat(item.val()['infraredMax']);
      }
      if (imin === null || imin > parseFloat(item.val()['infraredMin'])) {
          imin = parseFloat(item.val()['infraredMin']);
      }
      if (vmax === null || vmax < parseFloat(item.val()['visibleMax'])) {
          vmax = parseFloat(item.val()['visibleMax']);
      }
      if (vmin === null || vmin > parseFloat(item.val()['visibleMin'])) {
          vmin = parseFloat(item.val()['visibleMin']);
      }
      count++;
    })
    var obj = {
      'iavg': (iavg/count).toFixed(2),
      'vavg': (vavg/count).toFixed(2),
      'count': count,
      'imin': imin,
      'imax': imax,
      'vmin': vmin,
      'vmax': vmax
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

  function emptyIVScopes() {
    $scope.ivdata = [];
    $scope.ivlabels = [];
  }

  function emptyIScopes() {
    $scope.idata = [];
    $scope.ilabels = [];
  }

  function emptyVScopes() {
    $scope.vdata = [];
    $scope.vlabels = [];
  }

  function emptyLScopes() {
    $scope.ldata = [];
    $scope.llabels = [];
  }

  function updateIVData(iavg, vavg) {
    $scope.ivdata.push(iavg);
    $scope.ivdata.push(vavg);
  }

  function updateIData(avg, min, max) {
    $scope.idata.push(avg);
    $scope.idata.push(min);
    $scope.idata.push(max);
  }

  function updateVData(avg, min, max) {
    $scope.vdata.push(avg);
    $scope.vdata.push(min);
    $scope.vdata.push(max);
  }

  function updateLData(avg, min, max) {
    $scope.ldata.push(avg);
    $scope.ldata.push(min);
    $scope.ldata.push(max);
  }

  function moreLessTen(val) {
    if (val < 10) {
      return '0'+val;
    }
    else {
      return val;
    }
  }

  function setIVExplanations(val) {
    if (val === 1) {
      $scope.iviExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.ivvExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
    }
    else if (val === 2) {
      $scope.iviExpl = 'is the average infarared light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.ivvExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
    }
    else if (val === 3) {
      $scope.iviExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.ivvExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
    }
    else if (val === 4) {
      $scope.iviExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.ivvExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
    }
  }

  function setIExplanations(val) {
    if (val === 1) {
      $scope.iavgExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.iminExpl = 'is the minimum infrared light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.imaxExpl = 'is the maximum infrared light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
    }
    else if (val === 2) {
      $scope.iavgExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.iminExpl = 'is the minimum infrared light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.imaxExpl = 'is the maximum infrared light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
    }
    else if (val === 3) {
      $scope.iavgExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.iminExpl = 'is the minimum infrared light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.imaxExpl = 'is the maximum infrared light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
    }
    else if (val === 4) {
      $scope.iavgExpl = 'is the average infrared light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.iminExpl = 'is the minimum infrared light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.imaxExpl = 'is the maximum infrared light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
    }
  }

  function setVExplanations(val) {
    if (val === 1) {
      $scope.vavgExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.vminExpl = 'is the minimum visible light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.vmaxExpl = 'is the maximum visible light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
    }
    else if (val === 2) {
      $scope.vavgExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.vminExpl = 'is the minimum visible light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.vmaxExpl = 'is the maximum visible light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
    }
    else if (val === 3) {
      $scope.vavgExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.vminExpl = 'is the minimum visible light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.vmaxExpl = 'is the maximum visible light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
    }
    else if (val === 4) {
      $scope.vavgExpl = 'is the average visible light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.vminExpl = 'is the minimum visible light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.vmaxExpl = 'is the maximum visible light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
    }
  }

  function setLExplanations(val) {
    if (val === 1) {
      $scope.lavgExpl = 'is the average lux level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.lminExpl = 'is the minimum lux level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
      $scope.lmaxExpl = 'is the maximum lux level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.';
    }
    else if (val === 2) {
      $scope.lavgExpl = 'is the average lux level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.lminExpl = 'is the minimum lux level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
      $scope.lmaxExpl = 'is the maximum lux level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.';
    }
    else if (val === 3) {
      $scope.lavgExpl = 'is the average lux level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.lminExpl = 'is the minimum lux level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
      $scope.lmaxExpl = 'is the maximum lux level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.';
    }
    else if (val === 4) {
      $scope.lavgExpl = 'is the average lux level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.lminExpl = 'is the minimum lux level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
      $scope.lmaxExpl = 'is the maximum lux level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.';
    }
  }

});