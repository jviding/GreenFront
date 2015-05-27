'use strict';

/**
 * @ngdoc function
 * @name greenFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the greenFrontApp
 */
angular.module('greenFrontApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
