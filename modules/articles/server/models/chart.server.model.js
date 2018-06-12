'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  ChartjsNode = require('chartjs-node'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Article Schema
 */
var Chart = new Schema();

Chart.statics.exportChart = function (data) {
  return new Promise(function (resolve, reject) {
    const testimagePath = 'public/data/testimage.png';
    var chartJsOptions = {
      type: 'doughnut',
      data: data,
      options: {
        plugins: {}
      }
    };

    const chartNode = new ChartjsNode(1000, 200);
    chartNode.drawChart(chartJsOptions)
      .then(() => {
        // chart is created
        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
      })
      .then(buffer => {
        Array.isArray(buffer); // => true
        // as a stream
        return chartNode.getImageStream('image/png');
      })
      .then(streamResult => {
        // using the length property you can do things like
        // directly upload the image to s3 by using the
        // stream and length properties
        streamResult.stream; // => Stream object
        streamResult.length; // => Integer length of stream
        // write to a file
        return chartNode.writeImageToFile('image/png', testimagePath);
      })
      .then(() => {
        resolve(testimagePath);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

// masterCheckSheetForm7
mongoose.model('Chart', Chart);
