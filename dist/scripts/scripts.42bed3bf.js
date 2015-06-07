"use strict";angular.module("greenFrontApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","chart.js","firebase"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/air",{templateUrl:"views/air.html",controller:"AirCtrl"}).when("/light",{templateUrl:"views/light.html",controller:"LightCtrl"}).when("/noice",{templateUrl:"views/noice.html",controller:"NoiceCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("greenFrontApp").controller("MainCtrl",["$scope","$timeout","HeaderService",function(a,b,c){function d(a,c){var d=new Firebase("https://radiant-heat-5119.firebaseio.com"+a),e=d.orderByChild("timestamp").limitToLast(1);e.on("value",function(a){b(function(){a.forEach(function(a){c(a)})})})}c.view("home"),a.noice="",a.airtemp="",a.airhumid="",a.lightinfra="",a.lightvisible="",a.lightlux="",$(".carousel").carousel({interval:3e3}),d("/voices",function(b){a.noice=b.val().average}),d("/temperatures",function(b){a.airtemp=b.val().average}),d("/humidities",function(b){a.airhumid=b.val().average}),d("/infraredandvisible",function(b){a.lightinfra=b.val().infraredAverage,a.lightvisible=b.val().visibleAverage}),d("/lux",function(b){a.lightlux=b.val().average})}]),angular.module("greenFrontApp").controller("AirCtrl",["$scope","$timeout","HeaderService",function(a,b,c){function d(a,c,d){K=null!==c?M.orderByChild("timestamp").startAt(a).limitToLast(c):M.orderByChild("timestamp").startAt(a),K.on("value",function(a){b(function(){D(),d(a)})})}function e(a,c,d){L=null!==c?N.orderByChild("timestamp").startAt(a).limitToLast(c):N.orderByChild("timestamp").startAt(a),L.on("value",function(a){b(function(){E(),d(a)})})}function f(a){var b=[],c=[],d=[];a.forEach(function(a){c.push(a.val().min),d.push(a.val().max),b.push(a.val().average),p(a)}),F(b,c,d)}function g(a){var b=[],c=[],d=[];a.forEach(function(a){var e=z(a);e.count>0&&(b.push(e.average),d.push(e.max),c.push(e.min),n(a[0]))}),F(b,c,d)}function h(a){var b=[],c=[],d=[];a.forEach(function(a){var e=z(a);e.count>0&&(b.push(e.average),d.push(e.max),c.push(e.min),o(a[0]))}),F(b,c,d)}function i(a){var b=[],c=[],d=[];a.forEach(function(a){a.forEach(function(a){var e=z(a);e.count>0&&(b.push(e.average),d.push(e.max),c.push(e.min),q(a[0]))})}),F(b,c,d)}function j(a){var b=[];a.forEach(function(a){b.push(a.val().average),t(a)}),G(b,null,null)}function k(a){var b=[],c=[],d=[];a.forEach(function(a){var e=z(a);e.count>0&&(b.push(e.average),d.push(e.max),c.push(e.min),r(a[0]))}),G(b,c,d)}function l(a){var b=[],c=[],d=[];a.forEach(function(a){var e=z(a);e.count>0&&(b.push(e.average),d.push(e.max),c.push(e.min),s(a[0]))}),G(b,c,d)}function m(a){var b=[],c=[],d=[];a.forEach(function(a){a.forEach(function(a){var e=z(a);e.count>0&&(console.log(e),b.push(e.average),d.push(e.max),c.push(e.min),u(a[0]))})}),G(b,c,d)}function n(b){var c=new Date(b.val().timestamp);a.templabels.push(H(c.getDate())+"."+H(c.getMonth())+".")}function o(b){var c=new Date(b.val().timestamp);a.templabels.push(H(c.getHours())+":00")}function p(b){var c=new Date(b.val().timestamp);a.templabels.push(H(c.getHours())+":"+H(c.getMinutes()))}function q(b){var c="",d=new Date(b.val().timestamp).getDay();c=0===d?"Sun. ":1===d?"Mon. ":2===d?"Tue. ":3===d?"Wed. ":4===d?"Thu. ":5===d?"Fri. ":"Sat. ",new Date(b.val().timestamp).getHours()<6?a.templabels.push(c+"3am"):new Date(b.val().timestamp).getHours()>=6&&new Date(b.val().timestamp).getHours()<12?a.templabels.push(c+"9am"):new Date(b.val().timestamp).getHours()>=12&&new Date(b.val().timestamp).getHours()<18?a.templabels.push(c+"3pm"):a.templabels.push(c+"9pm")}function r(b){var c=new Date(b.val().timestamp);a.humidlabels.push(H(c.getDate())+"."+H(c.getMonth())+".")}function s(b){var c=new Date(b.val().timestamp);a.humidlabels.push(H(c.getHours())+":00")}function t(b){var c=new Date(b.val().timestamp);a.humidlabels.push(H(c.getHours())+":"+H(c.getMinutes()))}function u(b){var c="",d=new Date(b.val().timestamp).getDay();c=0===d?"Sun. ":1===d?"Mon. ":2===d?"Tue. ":3===d?"Wed. ":4===d?"Thu. ":5===d?"Fri. ":"Sat. ",new Date(b.val().timestamp).getHours()<6?a.humidlabels.push(c+"3am"):new Date(b.val().timestamp).getHours()>=6&&new Date(b.val().timestamp).getHours()<12?a.humidlabels.push(c+"9am"):new Date(b.val().timestamp).getHours()>=12&&new Date(b.val().timestamp).getHours()<18?a.humidlabels.push(c+"3pm"):a.humidlabels.push(c+"9pm")}function v(){var a=new Date,b=25056e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function w(){var a=new Date,b=5184e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function x(){var a=new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()}function y(){var a=(new Date,36e5);return(new Date).getTime()-a}function z(a){var b=0,c=0,d=null,e=null;a.forEach(function(a){b+=parseFloat(a.val().average),(null===e||e<parseFloat(a.val().max))&&(e=parseFloat(a.val().max)),(null===d||d<parseFloat(a.val().min))&&(d=parseFloat(a.val().min)),c++});var f={average:(b/c).toFixed(2),max:e,min:d,count:c};return f}function A(a){for(var b=[],c=0;24>c;c++)b[c]=[];return a.forEach(function(a){b[new Date(a.val().timestamp).getHours()].push(a)}),b}function B(a){for(var b=[],c=0;30>c;c++)b[c]=[];var d=null,e=0;return a.forEach(function(a){null===d&&(d=new Date(a.val().timestamp).getDate()),d!==new Date(a.val().timestamp).getDate()&&(d=new Date(a.val().timestamp).getDate(),e++),b[e].push(a)}),b}function C(a){for(var b=[],c=0;7>c;c++){b[c]=[];for(var d=0;4>d;d++)b[c][d]=[]}var e=null,f=0;return a.forEach(function(a){null===e&&(e=new Date(a.val().timestamp).getDate()),e!==new Date(a.val().timestamp).getDate()&&(e=new Date(a.val().timestamp).getDate(),f++),new Date(a.val().timestamp).getHours()>=0&&new Date(a.val().timestamp).getHours()<6?b[f][0].push(a):new Date(a.val().timestamp).getHours()>=6&&new Date(a.val().timestamp).getHours()<12?b[f][1].push(a):new Date(a.val().timestamp).getHours()>=12&&new Date(a.val().timestamp).getHours()<18?b[f][2].push(a):b[f][3].push(a)}),b}function D(){a.tempdata=[],a.templabels=[]}function E(){a.humiddata=[],a.humidlabels=[]}function F(b,c,d){a.tempdata.push(b),a.tempdata.push(c),a.tempdata.push(d)}function G(b,c,d){null===c&&null===d?(a.humidseries=["Humidity (%)"],a.humiddata.push(b)):(a.humidseries=["Average (%)","Min (%)","Max (%)"],a.humiddata.push(b),a.humiddata.push(c),a.humiddata.push(d))}function H(a){return 10>a?"0"+a:a}function I(b){1===b?(a.tempAvgExpl="is calculated from the outputs of the 5 second loops over 5 minutes of time. For example 04:43 represents the time between 04:38:00 and 04:42:59.",a.tempMinMaxExpl="is the lowest/highest single output received from the 5 second loops over the 5 minutes of time."):2===b?(a.tempAvgExpl="is calculated from the outputs of the 5 second loops over 1 hour of time. For example 04:00 represents the time between 04:00 and 04:59.",a.tempMinMaxExpl="is the lowest/highest single output received from the 5 second loops over the 1 hour of time."):3===b?(a.tempAvgExpl="is calculated from the outputs of the 5 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.tempMinMaxExpl="is the lowest/highest single output received from the 5 second loops over the 6 hours of time."):4===b&&(a.tempAvgExpl="is calculated from the outputs of the 5 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.tempMinMaxExpl="is the lowest/highest single output received from the 5 second loops over the 1 day of time.")}function J(b){1===b?(a.visible=!1,a.humidAvgExpl="",a.humidMinMaxExpl=""):2===b?(a.visible=!0,a.humidAvgExpl="is calculated from the outputs of the 5 minute loops over 1 hour of time. For example 04:00 represents the time between 04:00 and 04:59.",a.humidMinMaxExpl="is the lowest/highest single output received from the 5 minute loops over the 1 hour of time."):3===b?(a.visible=!0,a.humidAvgExpl="is calculated from the outputs of the 5 minute loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.humidMinMaxExpl="is the lowest/highest single output received from the 5 minute loops over the 6 hours of time."):4===b&&(a.visible=!0,a.humidAvgExpl="is calculated from the outputs of the 5 minute loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.humidMinMaxExpl="is the lowest/highest single output received from the 5 minute loops over the 1 day of time.")}c.view("air");var K,L,M=new Firebase("https://radiant-heat-5119.firebaseio.com/temperatures"),N=new Firebase("https://radiant-heat-5119.firebaseio.com/humidities");a.items=["1 hour","1 day","1 week","1 month"],a.tempview="1 hour",a.humidview="1 hour",a.templabels=[],a.tempseries=["Average (℃)","Min (℃)","Max (℃)"],a.tempdata=[],a.humidlabels=[],a.humidseries=["Average (%)","Min (%)","Max (%)"],a.humiddata=[],I(1),d(y(),30,function(a){f(a)}),J(1),e(y(),30,function(a){j(a)}),a.onTempClick=function(b){a.view!==b&&(a.tempview=b,"1 hour"===b&&(I(1),d(y(),30,function(a){f(a)})),"1 day"===b&&(I(2),d(x(),null,function(a){h(A(a))})),"1 week"===b&&(I(3),d(w(),null,function(a){i(C(a))})),"1 month"===b&&(I(4),d(v(),null,function(a){g(B(a))})))},a.onHumidClick=function(b){a.humidview!==b&&(a.humidview=b,"1 hour"===b&&(J(1),e(y(),30,function(a){j(a)})),"1 day"===b&&(J(2),e(x(),null,function(a){l(A(a))})),"1 week"===b&&(J(3),e(w(),null,function(a){m(C(a))})),"1 month"===b&&(J(4),e(v(),null,function(a){k(B(a))})))}}]),angular.module("greenFrontApp").controller("NoiceCtrl",["$scope","$timeout","HeaderService",function(a,b,c){function d(a,c,d){y=null!==c?z.orderByChild("timestamp").startAt(a).limitToLast(c):z.orderByChild("timestamp").startAt(a),y.on("value",function(a){b(function(){u(),d(a)})})}function e(a){var b=[],c=[];a.forEach(function(a){b.push(a.val().loudest),c.push(a.val().average),k(a)}),v(c,b)}function f(a){var b=[],c=[];a.forEach(function(a){var d=q(a);d.count>0&&(b.push(d.average),c.push(d.loudest),i(a[0]))}),v(b,c)}function g(a){var b=[],c=[];a.forEach(function(a){var d=q(a);d.count>0&&(b.push(d.average),c.push(d.loudest),j(a[0]))}),v(b,c)}function h(a){var b=[],c=[];a.forEach(function(a){a.forEach(function(a){var d=q(a);d.count>0&&(b.push(d.average),c.push(d.loudest),l(a[0]))})}),v(b,c)}function i(b){var c=new Date(b.val().timestamp);a.labels.push(w(c.getDate())+"."+w(c.getMonth())+".")}function j(b){var c=new Date(b.val().timestamp);a.labels.push(w(c.getHours())+":00")}function k(b){var c=new Date(b.val().timestamp);a.labels.push(w(c.getHours())+":"+w(c.getMinutes()))}function l(b){var c="",d=new Date(b.val().timestamp).getDay();c=0===d?"Sun. ":1===d?"Mon. ":2===d?"Tue. ":3===d?"Wed. ":4===d?"Thu. ":5===d?"Fri. ":"Sat. ",new Date(b.val().timestamp).getHours()<6?a.labels.push(c+"3am"):new Date(b.val().timestamp).getHours()>=6&&new Date(b.val().timestamp).getHours()<12?a.labels.push(c+"9am"):new Date(b.val().timestamp).getHours()>=12&&new Date(b.val().timestamp).getHours()<18?a.labels.push(c+"3pm"):a.labels.push(c+"9pm")}function m(){var a=new Date,b=25056e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function n(){var a=new Date,b=5184e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function o(){var a=new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()}function p(){var a=(new Date,36e5);return(new Date).getTime()-a}function q(a){var b=0,c=0,d=0;a.forEach(function(a){b+=parseFloat(a.val().average),d<parseInt(a.val().loudest)&&(d=parseInt(a.val().loudest)),c++});var e={average:(b/c).toFixed(2),loudest:d,count:c};return e}function r(a){for(var b=[],c=0;24>c;c++)b[c]=[];return a.forEach(function(a){b[new Date(a.val().timestamp).getHours()].push(a)}),b}function s(a){for(var b=[],c=0;30>c;c++)b[c]=[];var d=null,e=0;return a.forEach(function(a){null===d&&(d=new Date(a.val().timestamp).getDate()),d!==new Date(a.val().timestamp).getDate()&&(d=new Date(a.val().timestamp).getDate(),e++),b[e].push(a)}),b}function t(a){for(var b=[],c=0;7>c;c++){b[c]=[];for(var d=0;4>d;d++)b[c][d]=[]}var e=null,f=0;return a.forEach(function(a){null===e&&(e=new Date(a.val().timestamp).getDate()),e!==new Date(a.val().timestamp).getDate()&&(e=new Date(a.val().timestamp).getDate(),f++),new Date(a.val().timestamp).getHours()>=0&&new Date(a.val().timestamp).getHours()<6?b[f][0].push(a):new Date(a.val().timestamp).getHours()>=6&&new Date(a.val().timestamp).getHours()<12?b[f][1].push(a):new Date(a.val().timestamp).getHours()>=12&&new Date(a.val().timestamp).getHours()<18?b[f][2].push(a):b[f][3].push(a)}),b}function u(){a.data=[],a.labels=[]}function v(b,c){a.data.push(b),a.data.push(c)}function w(a){return 10>a?"0"+a:a}function x(b){1===b?(a.avgExpl="is the average noice calculated from the outputs of the 0.5 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.peakExpl="is the highest single output received from the 0.5 second loops over the 2 minutes of time."):2===b?(a.avgExpl="is the average noice calculated from the outputs of the 0.5 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.peakExpl="is the highest single output received from the 0.5 second loops over the 1 hour of time."):3===b?(a.avgExpl="is the average noice calculated from the outputs of the 0.5 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.peakExpl="is the highest single output received from the 0.5 second loops over the 6 hours of time."):4===b&&(a.avgExpl="is the average noice calculated from the outputs of the 0.5 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.peakExpl="is the highest single output received from the 0.5 second loops over the 1 day of time.")}c.view("noice");var y,z=new Firebase("https://radiant-heat-5119.firebaseio.com/voices");a.view="1 hour",a.items=["1 hour","1 day","1 week","1 month"],a.series=["Average","Peak"],a.labels=[],a.data=[],a.avgExpl="",a.peakExpl="",x(1),d(p(),30,function(a){e(a)}),a.onClick=function(b){a.view!==b&&(a.view=b,"1 hour"===b&&(x(1),d(p(),30,function(a){e(a)})),"1 day"===b&&(x(2),d(o(),null,function(a){g(r(a))})),"1 week"===b&&(x(3),d(n(),null,function(a){h(t(a))})),"1 month"===b&&(x(4),d(m(),null,function(a){f(s(a))})))}}]),angular.module("greenFrontApp").controller("LightCtrl",["$scope","$timeout","HeaderService",function(a,b,c){function d(a,c,d){if(null!==c)var e=V.orderByChild("timestamp").startAt(a).limitToLast(c);else var e=V.orderByChild("timestamp").startAt(a);e.on("value",function(a){b(function(){d(a)})})}function e(a,c,d){if(null!==c)var e=W.orderByChild("timestamp").startAt(a).limitToLast(c);else var e=W.orderByChild("timestamp").startAt(a);e.on("value",function(a){b(function(){d(a)})})}function f(b){L();var c=[],d=[],e=[];b.forEach(function(b){c.push(b.val().average),d.push(b.val().min),e.push(b.val().max),x(b,function(b){a.llabels.push(b)})}),P(c,d,e)}function g(b){L();var c=[],d=[],e=[];b.forEach(function(b){var f=D(b);f.count>0&&(c.push(f.avg),d.push(f.min),e.push(f.max),w(b[0],function(b){a.llabels.push(b)}))}),P(c,d,e)}function h(b){L();var c=[],d=[],e=[];b.forEach(function(b){b.forEach(function(b){var f=D(b);f.count>0&&(c.push(f.avg),d.push(f.min),e.push(f.max),y(b[0],function(b){a.llabels.push(b)}))})}),P(c,d,e)}function i(b){L();var c=[],d=[],e=[];b.forEach(function(b){var f=D(b);f.count>0&&(c.push(f.avg),d.push(f.min),e.push(f.max),v(b[0],function(b){a.llabels.push(b)}))}),P(c,d,e)}function j(b){K();var c=[],d=[],e=[];b.forEach(function(b){c.push(b.val().visibleAverage),d.push(b.val().visibleMin),e.push(b.val().visibleMax),x(b,function(b){a.vlabels.push(b)})}),O(c,d,e)}function k(b){K();var c=[],d=[],e=[];b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.vavg),d.push(f.vmin),e.push(f.vmax),w(b[0],function(b){a.vlabels.push(b)}))}),O(c,d,e)}function l(b){K();var c=[],d=[],e=[];b.forEach(function(b){b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.vavg),d.push(f.vmin),e.push(f.vmax),y(b[0],function(b){a.vlabels.push(b)}))})}),O(c,d,e)}function m(b){K();var c=[],d=[],e=[];b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.vavg),d.push(f.vmin),e.push(f.vmax),v(b[0],function(b){a.vlabels.push(b)}))}),O(c,d,e)}function n(b){J();var c=[],d=[],e=[];b.forEach(function(b){c.push(b.val().infraredAverage),d.push(b.val().infraredMin),e.push(b.val().infraredMax),x(b,function(b){a.ilabels.push(b)})}),N(c,d,e)}function o(b){J();var c=[],d=[],e=[];b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.iavg),d.push(f.imin),e.push(f.imax),w(b[0],function(b){a.ilabels.push(b)}))}),N(c,d,e)}function p(b){J();var c=[],d=[],e=[];b.forEach(function(b){b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.iavg),d.push(f.imin),e.push(f.imax),y(b[0],function(b){a.ilabels.push(b)}))})}),N(c,d,e)}function q(b){J();var c=[],d=[],e=[];b.forEach(function(b){var f=E(b);f.count>0&&(c.push(f.iavg),d.push(f.imin),e.push(f.imax),v(b[0],function(b){a.ilabels.push(b)}))}),N(c,d,e)}function r(b){I();var c=[],d=[];b.forEach(function(b){c.push(b.val().infraredAverage),d.push(b.val().visibleAverage),x(b,function(b){a.ivlabels.push(b)})}),M(c,d)}function s(b){I();var c=[],d=[];b.forEach(function(b){var e=E(b);e.count>0&&(c.push(e.iavg),d.push(e.vavg),w(b[0],function(b){a.ivlabels.push(b)}))}),M(c,d)}function t(b){I();var c=[],d=[];b.forEach(function(b){b.forEach(function(b){var e=E(b);e.count>0&&(c.push(e.iavg),d.push(e.vavg),y(b[0],function(b){a.ivlabels.push(b)}))})}),M(c,d)}function u(b){I();var c=[],d=[];b.forEach(function(b){var e=E(b);e.count>0&&(c.push(e.iavg),d.push(e.vavg),v(b[0],function(b){a.ivlabels.push(b)}))}),M(c,d)}function v(a,b){var c=new Date(a.val().timestamp);b(Q(c.getDate())+"."+Q(c.getMonth())+".")}function w(a,b){var c=new Date(a.val().timestamp);b(Q(c.getHours())+":00")}function x(a,b){var c=new Date(a.val().timestamp);b(Q(c.getHours())+":"+Q(c.getMinutes()))}function y(a,b){var c="",d=new Date(a.val().timestamp).getDay();c=0===d?"Sun. ":1===d?"Mon. ":2===d?"Tue. ":3===d?"Wed. ":4===d?"Thu. ":5===d?"Fri. ":"Sat. ",b(new Date(a.val().timestamp).getHours()<6?c+"3am":new Date(a.val().timestamp).getHours()>=6&&new Date(a.val().timestamp).getHours()<12?c+"9am":new Date(a.val().timestamp).getHours()>=12&&new Date(a.val().timestamp).getHours()<18?c+"3pm":c+"9pm")}function z(){var a=new Date,b=25056e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function A(){var a=new Date,b=5184e5;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()-b}function B(){var a=new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime()}function C(){var a=(new Date,36e5);return(new Date).getTime()-a}function D(a){var b=0,c=0,d=null,e=null;a.forEach(function(a){b+=parseFloat(a.val().average),(null===e||e<parseFloat(a.val().max))&&(e=parseFloat(a.val().max)),(null===d||d>parseFloat(a.val().min))&&(d=parseFloat(a.val().min)),c++});var f={avg:(b/c).toFixed(2),count:c,min:d,max:e};return f}function E(a){var b=0,c=0,d=0,e=null,f=null,g=null,h=null;a.forEach(function(a){b+=parseFloat(a.val().infraredAverage),c+=parseFloat(a.val().visibleAverage),(null===f||f<parseFloat(a.val().infraredMax))&&(f=parseFloat(a.val().infraredMax)),(null===e||e>parseFloat(a.val().infraredMin))&&(e=parseFloat(a.val().infraredMin)),(null===h||h<parseFloat(a.val().visibleMax))&&(h=parseFloat(a.val().visibleMax)),(null===g||g>parseFloat(a.val().visibleMin))&&(g=parseFloat(a.val().visibleMin)),d++});var i={iavg:(b/d).toFixed(2),vavg:(c/d).toFixed(2),count:d,imin:e,imax:f,vmin:g,vmax:h};return i}function F(a){for(var b=[],c=0;24>c;c++)b[c]=[];return a.forEach(function(a){b[new Date(a.val().timestamp).getHours()].push(a)}),b}function G(a){for(var b=[],c=0;30>c;c++)b[c]=[];var d=null,e=0;return a.forEach(function(a){null===d&&(d=new Date(a.val().timestamp).getDate()),d!==new Date(a.val().timestamp).getDate()&&(d=new Date(a.val().timestamp).getDate(),e++),b[e].push(a)}),b}function H(a){for(var b=[],c=0;7>c;c++){b[c]=[];for(var d=0;4>d;d++)b[c][d]=[]}var e=null,f=0;return a.forEach(function(a){null===e&&(e=new Date(a.val().timestamp).getDate()),e!==new Date(a.val().timestamp).getDate()&&(e=new Date(a.val().timestamp).getDate(),f++),new Date(a.val().timestamp).getHours()>=0&&new Date(a.val().timestamp).getHours()<6?b[f][0].push(a):new Date(a.val().timestamp).getHours()>=6&&new Date(a.val().timestamp).getHours()<12?b[f][1].push(a):new Date(a.val().timestamp).getHours()>=12&&new Date(a.val().timestamp).getHours()<18?b[f][2].push(a):b[f][3].push(a)}),b}function I(){a.ivdata=[],a.ivlabels=[]}function J(){a.idata=[],a.ilabels=[]}function K(){a.vdata=[],a.vlabels=[]}function L(){a.ldata=[],a.llabels=[]}function M(b,c){a.ivdata.push(b),a.ivdata.push(c)}function N(b,c,d){a.idata.push(b),a.idata.push(c),a.idata.push(d)}function O(b,c,d){a.vdata.push(b),a.vdata.push(c),a.vdata.push(d)}function P(b,c,d){a.ldata.push(b),a.ldata.push(c),a.ldata.push(d)}function Q(a){return 10>a?"0"+a:a}function R(b){1===b?(a.iviExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.ivvExpl="is the average visible light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59."):2===b?(a.iviExpl="is the average infarared light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.ivvExpl="is the average visible light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59."):3===b?(a.iviExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.ivvExpl="is the average visible light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00."):4===b&&(a.iviExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.ivvExpl="is the average visible light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.")}function S(b){1===b?(a.iavgExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.iminExpl="is the minimum infrared light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.imaxExpl="is the maximum infrared light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59."):2===b?(a.iavgExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.iminExpl="is the minimum infrared light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.imaxExpl="is the maximum infrared light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59."):3===b?(a.iavgExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.iminExpl="is the minimum infrared light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.imaxExpl="is the maximum infrared light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00."):4===b&&(a.iavgExpl="is the average infrared light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.iminExpl="is the minimum infrared light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.imaxExpl="is the maximum infrared light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.")}function T(b){1===b?(a.vavgExpl="is the average visible light level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.vminExpl="is the minimum visible light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.vmaxExpl="is the maximum visible light level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59."):2===b?(a.vavgExpl="is the average visible light level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.vminExpl="is the minimum visible light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.vmaxExpl="is the maximum visible light level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59."):3===b?(a.vavgExpl="is the average visible light level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.vminExpl="is the minimum visible light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.vmaxExpl="is the maximum visible light level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00."):4===b&&(a.vavgExpl="is the average visible light level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.vminExpl="is the minimum visible light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.vmaxExpl="is the maximum visible light level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.")}function U(b){1===b?(a.lavgExpl="is the average lux level calculated from the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.lminExpl="is the minimum lux level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59.",a.lmaxExpl="is the maximum lux level measure from all the outputs of the 1 second loops over 2 minutes of time. For example 18:02 represents the time between 18:00:00 and 18:01:59."):2===b?(a.lavgExpl="is the average lux level calculated from the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.lminExpl="is the minimum lux level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59.",a.lmaxExpl="is the maximum lux level measure from all the outputs of the 1 second loops over 1 hour of time. For example 18:00 represents the time between 18:00 and 18:59."):3===b?(a.lavgExpl="is the average lux level calculated from the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.lminExpl="is the minimum lux level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00.",a.lmaxExpl="is the maximum lux level measure from all the outputs of the 1 second loops over 6 hours of time. For example 3am represents the time between 00:00 and 06:00."):4===b&&(a.lavgExpl="is the average lux level calculated from the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.lminExpl="is the minimum lux level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.",a.lmaxExpl="is the maximum lux level measure from all the outputs of the 1 second loops over 1 day of time. For example 01.05. represents the time between 00:00 and 23:59 that same day.")}c.view("light");var V=new Firebase("https://radiant-heat-5119.firebaseio.com/infraredandvisible"),W=new Firebase("https://radiant-heat-5119.firebaseio.com/lux");a.items=["1 hour","1 day","1 week","1 month"],a.ivview="1 hour",a.iview="1 hour",a.vview="1 hour",a.lview="1 hour",a.ivlabels=[],a.ivseries=["Infrared","Visible"],a.ivdata=[],a.ilabels=[],a.iseries=["Average","Min","Max"],a.idata=[],a.vlabels=[],a.vseries=["Average","Min","Max"],a.vdata=[],a.llabels=[],a.lseries=["Average (lx)","Min (lx)","Max (lx)"],a.ldata=[],R(1),d(C(),30,function(a){r(a)}),S(1),d(C(),30,function(a){n(a)}),T(1),d(C(),30,function(a){j(a)}),U(1),e(C(),30,function(a){f(a)}),a.onIVClick=function(b){a.view!==b&&(a.ivview=b,"1 hour"===b&&(R(1),d(C(),30,function(a){r(a)})),"1 day"===b&&(R(2),d(B(),null,function(a){s(F(a))})),"1 week"===b&&(R(3),d(A(),null,function(a){t(H(a))})),"1 month"===b&&(R(4),d(z(),null,function(a){u(G(a))})))},a.onIClick=function(b){a.iview!==b&&(a.iview=b,"1 hour"===b&&(S(1),d(C(),30,function(a){n(a)})),"1 day"===b&&(S(2),d(B(),null,function(a){o(F(a))})),"1 week"===b&&(S(3),d(A(),null,function(a){p(H(a))})),"1 month"===b&&(S(4),d(z(),null,function(a){q(G(a))})))},a.onVClick=function(b){a.vview!==b&&(a.vview=b,"1 hour"===b&&(T(1),d(C(),30,function(a){j(a)})),"1 day"===b&&(T(2),d(B(),null,function(a){k(F(a))})),"1 week"===b&&(T(3),d(A(),null,function(a){l(H(a))})),"1 month"===b&&(T(4),d(z(),null,function(a){m(G(a))})))},a.onLClick=function(b){a.lview!==b&&(a.lview=b,"1 hour"===b&&(U(1),e(C(),30,function(a){f(a)})),"1 day"===b&&(U(2),e(B(),null,function(a){g(F(a))})),"1 week"===b&&(U(3),e(A(),null,function(a){h(H(a))})),"1 month"===b&&(U(4),e(z(),null,function(a){i(G(a))})))}}]),angular.module("greenFrontApp").service("HeaderService",function(){return{view:function(a){for(var b=document.getElementById("choices").children,c=0;c<b.length;c++)b[c].className="";document.getElementById(a).className="active"}}});