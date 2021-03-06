'use strict';

angular
  .module('greenFrontApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chart.js',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/air', {
        templateUrl: 'views/air.html',
        controller: 'AirCtrl'
      })
      .when('/light', {
        templateUrl: 'views/light.html',
        controller: 'LightCtrl'
      })
      .when('/noice', {
        templateUrl: 'views/noice.html',
        controller: 'NoiceCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });