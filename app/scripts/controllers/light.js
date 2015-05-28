'use strict';

/**
 * @ngdoc function
 * @name greenFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the greenFrontApp
 */
angular.module('greenFrontApp')
  .controller('LightCtrl', function ($scope) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','January', 'February', 'March', 'April', 'May', 'June', 'July'];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [200, 259, 280, 281, 256, 255, 240,200, 259, 280, 281, 256, 255, 240],
    [228, 248, 240, 219, 286, 227, 290,228, 248, 240, 219, 286, 227, 290]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  });