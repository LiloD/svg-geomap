'use strict';

var d3 = require('d3');
var _ = require('lodash');

var CanvasController = function($scope, d3Helper, $q, dataGenerator, $mdSidenav){
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
        
        var width = 960;
        var height = 500;

        var viewport = d3.select('#canvas')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('id', 'viewport');

        var path = d3.geoPath();
        
        var projection = d3.geoAlbersUsa()
                        .scale(1200)
                        .translate([width / 2, height / 2]);

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
                            .attr("stroke", "black")
                            .attr("stroke-width", "0.5")
                            .attr("stroke-dasharray", "5")
                            .attr('fill', 'white');
                    }

                    if(cities){

                        // $scope.cities = cities;
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
                                .style('stroke', '#AAAAAA')
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

CanvasController.$inject = ['$scope', 'd3Helper', '$q', 'dataGenerator', '$mdSidenav'];

module.exports = CanvasController;