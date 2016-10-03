'use strict';
var angular = require('angular');

require('./shared/shared.module');
require('./canvas/canvas.module');

var dependencies = ['ngMaterial', 'geomap.canvas', 'shared.module'];

var app = angular.module('App', dependencies);
