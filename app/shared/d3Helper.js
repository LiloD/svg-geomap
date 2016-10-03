'use strict';

var d3 = require('d3');

var d3Helper = function($q){
    function json(path){
        var deferred = $q.defer();
        d3.json(path, function(data){
            deferred.resolve(data);
        });

        return deferred.promise;
    }

    function csv(path){
        var deferred = $q.defer();
        d3.csv(path, function(data){
            deferred.resolve(data);
        });

        return deferred.promise;
    }

    return {
        json: json,
        csv: csv
    };
}

d3Helper.$inject = ['$q'];

module.exports = d3Helper;