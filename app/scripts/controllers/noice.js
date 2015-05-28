'use strict';

angular.module('greenFrontApp')
  .controller('NoiceCtrl', function ($scope, $firebaseArray) {
    var ref = new Firebase('https://radiant-heat-5119.firebaseio.com/voices');
    $scope.labels = [];
    $scope.series = ['Average', 'Peak'];
    $scope.data = [];

    ref.on("value", function(snapshot) {
      createData(snapshot, function(avg, loudest) {
        $scope.data = [];
        $scope.labels = [];
        $scope.data.push(avg);
        $scope.data.push(loudest);
        createLabels(avg.length, $scope.labels);
      });
    });
  
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

  function createData(voices, callback) {
    var loudest = [];
    var avg = [];
    voices.forEach(function(item) {
      console.log(item.val());
      loudest.push(item.val()['loudest']);
      avg.push(item.val()['average']);
    });
    callback(avg, loudest);
  };

  function createLabels(count, labels) {
    for (var i=0;i<count;i++) {
      labels.push((i+1).toString());
    }
  };