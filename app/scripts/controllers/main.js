'use strict';

/**
 * @ngdoc function
 * @name greenFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenFrontApp
 */
angular.module('greenFrontApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
