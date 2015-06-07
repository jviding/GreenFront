'use strict';

angular.module('greenFrontApp')
  .service('HeaderService', function() {
  	return {
  		view: function(view) {
  			var elements = document.getElementById('choices').children;
			for (var i = 0; i<elements.length; i++) {
				elements[i].className = '';
			}
			document.getElementById(view).className = 'active';
  		}
  	};
  });