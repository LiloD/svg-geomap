'use strict';

var _ = require('lodash');

//inclusive lower and upper bounds
function getRandPair(lower, upper){
    if(lower >= upper) return;
    
    var first = _.random(lower, upper);
    var second = _.random(lower, upper);

    while(second == first){
        second = _.random(lower, upper);
    }

    return [first, second];
}

var dataGenerator = function(){

    function getData(){
        var cities = ['DAL', 'NY', 'LA'];
        var data = [];

        for(var i = 0; i < 5; i++){
            var pair = getRandPair(0, cities.length-1);
            for(var j = 0; j < 5; j++){
                data.push({
                    origin: cities[pair[0]],
                    destination: cities[pair[1]],
                    value: _.random(1000)
                });
            }
        }

        return data;
    }

    return {
        getData: getData
    };
}

module.exports = dataGenerator;