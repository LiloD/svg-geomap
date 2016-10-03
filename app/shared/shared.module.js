'use strict';

angular.module('shared.module', [])
        .factory('d3Helper', require('./d3Helper'))
        .factory('dataGenerator', require('./dataGenerator'));