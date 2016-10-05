'use strict';

var angular = require('angular');

var CanvasDirective = function($compile){
    return {
        restrict:'E',
        scope: {},
        template: require('./canvas.template.html'),
        controller: 'CanvasController',
        link: function(scope, element, attr, controller){
            scope.init()
                .then(function(){
                    //rewrap    
                    var viewport = angular.element(document.querySelector('#viewport'));
                    var svg = angular.element(document.querySelector('svg'));

                    function getMatrixString(SVGMatrix){
                        var str = [SVGMatrix.a, SVGMatrix.b, SVGMatrix.c, SVGMatrix.d, SVGMatrix.e, SVGMatrix.f].join(',');
                        return 'matrix(' + str + ')';
                    }

                    svg.on('dblclick', (function(){
                        var zoom = 1;
                        return function(event){
                            viewport.css('transition', 'transform 300ms linear');
                            var ntm;

                            if(zoom > 0){
                                var target = event.currentTarget;
                                var rect = target.getBoundingClientRect();
                                var x = event.clientX - rect.left;
                                var y = event.clientY - rect.top;
                                
                                var dx = x - rect.width/4;
                                var dy = y - rect.height/4;
                                dx = dx < 0 ? 0 : dx;
                                dy = dy < 0 ? 0 : dy;
                                dx = -dx;
                                dy = -dy;

                                ntm = viewport[0].getCTM().translate(x, y).scale(2.0).translate(-x, -y);

                            }else{
                                ntm = viewport[0].getCTM().multiply(viewport[0].getCTM().inverse());
                            }
                            viewport.css('transform', getMatrixString(ntm));
                            zoom *= -1;
                        }
                    })());

                    var pan = -1;
            
                    viewport.on('mousedown', function(){
                        pan = 1;
                    });

                    viewport.on('mouseup', function(){
                        pan = -1;
                    });
                    
                    viewport.on('mousemove', (function(){
                        var prevx, prevy;
                        return function(event){
                            var x = event.clientX;
                            var y = event.clientY;
                            if(pan > 0){
                                var dx = 0, dy = 0;
                                if(prevx) dx = x - prevx;
                                if(prevy) dy = y - prevy;
                                var ctm = viewport[0].getCTM();
                                var ntm = ctm.multiply(ctm.inverse()).translate(dx, dy).multiply(ctm);
                                viewport.css('transition', '');
                                viewport.css('transform', getMatrixString(ntm));
                                prevx = x;
                                prevy = y;
                            }else{
                                prevx = undefined;
                                prevy = undefined;
                            }
                        }
                    })());

                    // var circles = angular.element(document.querySelectorAll('circle'));
                    // _.forEach(circles, function(circle){
                    //     var tooltip = '<md-tooltip>hello world</md-tooltip>';
                    //     var el = $compile(tooltip)(scope);
                    //     angular.element(circle).append(el);
                    // })
                    // var tooltip = '<md-tooltip>hello world</md-tooltip>';
                    // var el = $compile(tooltip)(scope);
                    // element.find('div').append(el);

                });
        }
    }
}

CanvasDirective.$inject = ['$compile'];

module.exports = CanvasDirective;