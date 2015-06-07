'use strict';

angular.module('greenFrontApp')
  .controller('MainCtrl', function ($scope, $timeout, HeaderService) {
  	HeaderService.view('home');
  	$scope.noice = '';
  	$scope.airtemp = '';
  	$scope.airhumid = '';
  	$scope.lightinfra = '';
  	$scope.lightvisible = '';
  	$scope.lightlux = '';

  	$('.carousel').carousel({
  		interval: 3000
	});

  	setData('/voices', function(val) {
  		$scope.noice = val.val()['average'];
  	});
  	setData('/temperatures', function(val) {
  		$scope.airtemp = val.val()['average'];
  	});
  	setData('/humidities', function(val) {
  		$scope.airhumid = val.val()['average'];
  	});
  	setData('/infraredandvisible', function(val) {
  		$scope.lightinfra = val.val()['infraredAverage'];
  		$scope.lightvisible = val.val()['visibleAverage'];
  	});
  	setData('/lux', function(val) {
  		$scope.lightlux = val.val()['average'];
  	});

    function setData(url, callback) {
    	var ref = new Firebase('https://radiant-heat-5119.firebaseio.com'+url);
      	var query = ref.orderByChild('timestamp').limitToLast(1);
      	query.on('value', function(snapshot) {
        $timeout(function(){
        	snapshot.forEach(function(item) {
        		callback(item);
        	});
        });
      });
    }
  });
