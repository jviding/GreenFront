'use strict';
/**
 * @ngdoc function
 * @name greenFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the greenFrontApp
 */
angular.module('greenFrontApp')
  .controller('NoiceCtrl', function ($scope) { //$firebaseArray
    //var ref = new Firebase('https://radiant-heat-5119.firebaseio.com/voices');
    /*$scope.labels = ["January", "February", "March", "April", "May", "June", "July","January", "February", "March", "April", "May"];
    $scope.series = ['Average', 'Peak'];
   // $scope.data = []; */
    $scope.test = 'asd';

    /*$scope.data = [
      [200, 259, 280, 281, 256, 255, 240,200, 259, 280, 281, 256, 255, 240],
      [228, 248, 240, 219, 286, 227, 290,228, 248, 240, 219, 286, 227, 290]
    ];*/

 /**   ref.on("value", function(snapshot) {
      createData(snapshot, function(avg, loudest) {
        $scope.data = [];
        $scope.data.push(avg);
        $scope.data.push(loudest);
        console.log(avg);
        $scope.test = 'joo';
      });
    });

    $scope.$watch('data', function() {
      console.log("HEY MUUTUIN!");
      console.log($scope.data.toString());
    }); */
  
    /*$scope.onClick = function (points, evt) {
      console.log(points, evt);
    };*/
  });
/*
  function createData(voices, callback) {
    var loudest = [];
    var avg = [];
    voices.forEach(function(item) {
      loudest.push(item.val()['loudest']);
      avg.push(item.val()['average'].toFixed(2));
    });
    callback(avg, loudest);
  }; */