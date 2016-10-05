'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,

    entry: {
        vendor: './app/vendor.js',
        app: './app/app.js'
    },

    output: {
        path: './dist',
        publicPath: '/assets/',
        filename: '[name].bundle.js',
        sourceMapFilename: '[file].map'
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.json$/,
                loader: 'raw'
            },
            {
                test: /\.css$/,
                loaders: 'style!css'
            }
        ]
    },

    devtool: 'source-map',
    
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        })
    ]
}