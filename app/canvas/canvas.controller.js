'use strict';

var d3 = require('d3');
var _ = require('lodash');

var CanvasController = function($scope, d3Helper, $q, dataGenerator, $mdSidenav, $window){
    var data = dataGenerator.getData();

    $scope.cities = {};

    $scope.markets = {};

    _.forEach(data, function(entry){
        var key = [entry.origin, entry.destination].join('-');
        if(!$scope.markets[key]){
            $scope.markets[key] = { 
                'key':key, 
                'values': [entry.value]
            };
        }else{
            $scope.markets[key].values.push(entry.value);
        }
    });

    $scope.openRightMenu = function(){
        $mdSidenav('right').toggle();
    }
    
    $scope.init = function(){
        var innerWidth = $window.innerWidth;        
        var width = innerWidth;
        
        var viewport = d3.select('#canvas')
                    .append('svg')
                    .append('g')
                    .attr('id', 'viewport')

        var path = d3.geoPath();
        
        var projection = d3.geoAlbersUsa()
                        .scale(1500)
                        .translate([width / 2, 750 / 2]);


        path.projection(projection);

        return $q.all([d3Helper.json("us-states.json"), d3Helper.csv("cities.csv")])
                .then(function(data){
                    var geoData = data[0];
                    var cities = data[1];

                    if(geoData){
                        viewport.selectAll("path")
                            .data(geoData.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .attr("stroke", "white")
                            .attr("stroke-width", "1")
                            .attr("fill", "#8acff0") 
                    }

                    if(cities){

                        $scope.cities = {};

                        _.forEach(cities, function(city){
                            $scope.cities[city.place] = city;
                        })
                                                
                        viewport.selectAll("line")
                                .data(_.values($scope.markets))
                                .enter()
                                .append("line")
                                .attr("x1", function(d){
                                    var key = d.key;
                                    var m = key.split('-');
                                    return projection([$scope.cities[m[0]].lon, $scope.cities[m[0]].lat])[0];
                                })
                                .attr("y1", function(d){
                                    var key = d.key;
                                    var m = key.split('-');
                                    return projection([$scope.cities[m[0]].lon, $scope.cities[m[0]].lat])[1];
                                })
                                .attr("x2", function(d){
                                    var key = d.key;
                                    var m = key.split('-');
                                    return projection([$scope.cities[m[1]].lon, $scope.cities[m[1]].lat])[0];
                                })
                                .attr("y2", function(d){
                                    var key = d.key;
                                    var m = key.split('-');
                                    return projection([$scope.cities[m[1]].lon, $scope.cities[m[1]].lat])[1];
                                })
                                .style('stroke', 'yellow')
                                .style('stroke-width', '2')
                                .style('cursor', 'pointer')
                                .on('click', function(d){
                                    $scope.message = d;
                                    $mdSidenav('right').toggle();
                                });


                        viewport.selectAll("circle")
                            .data(cities)
                            .enter()
                            .append("circle")
                            .attr("cx", function(d) {
                                    return projection([d.lon, d.lat])[0];
                            })
                            .attr("cy", function(d) {
                                    return projection([d.lon, d.lat])[1];
                            })
                            .attr("r", 10)
                            .style("fill", "#BE29EC")
                            .style('cursor', 'pointer')
                            .on('click', function(d){
                                console.log(d);
                                $scope.message = d;
                                $mdSidenav('right').toggle();
                            });
                                
                    
                    }
                });
     };

};

CanvasController.$inject = ['$scope', 'd3Helper', '$q', 'dataGenerator', '$mdSidenav', '$window'];

module.exports = CanvasController;