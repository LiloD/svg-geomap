'use strict'

var angular = require('angular');

angular.module('geomap.canvas', ['shared.module'])
        .controller('CanvasController', require('./canvas.controller.js'))
        .directive('mapCanvas', require('./canvas.directive.js'));
       