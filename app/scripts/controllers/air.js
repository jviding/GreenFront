'use strict';

angular.module('greenFrontApp')
  .controller('AirCtrl', function ($scope, $timeout) {
    var tempRef = new Firebase('https://radiant-heat-5119.firebaseio.com/temperatures');
    var humidRef = new Firebase('https://radiant-heat-5119.firebaseio.com/humidities');
    
    $scope.templabels = [];
    $scope.tempseries = ['Min (℃)', 'Max (℃)'];
    $scope.tempdata = [];

    $scope.humidlabels = [];
    $scope.humidseries = ['Humidity (%)'];
    $scope.humiddata = [];

    tempRef.on("value", function(snapshot) {
      createTempData(snapshot, function(min, max) {
        $scope.tempdata = [];
        $scope.templabels = [];
        $timeout(function(){
          $scope.tempdata.push(min);
          $scope.tempdata.push(max);
          createLabels(min.length, $scope.templabels);
        });
      });
    });

    humidRef.on("value", function(snapshot) {
      createHumidData(snapshot, function(humidity) {
        $scope.humiddata = [];
        $scope.humidlabels = [];
        $timeout(function() {
          $scope.humiddata.push(humidity);
          createLabels(humidity.length, $scope.humidlabels);
        });
      });
    });
  
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

  function createTempData(data, callback) {
    var min = [];
    var max = [];
    data.forEach(function(item) {
      min.push(item.val()['min']);
      max.push(item.val()['max']);
    });
    callback(min, max);
  };

  function createHumidData(data, callback) {
    var humids = [];
    data.forEach(function(item) {
      humids.push(item.val()['humidity']);
    });
    callback(humids);
  };

  function createLabels(count, labels) {
    for (var i=0;i<count;i++) {
      labels.push((i+1).toString());
    }
  };
