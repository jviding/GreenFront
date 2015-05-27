'use strict';

angular.module('greenFrontApp').controller('HeaderCtrl', function ($scope) {
	$scope.update = function(selected) {
		var elements = document.getElementById('choices').children;
		for (var i = 0; i<elements.length; i++) {
			elements[i].className = '';
		}
		document.getElementById(selected).className = 'active';
	};
});
