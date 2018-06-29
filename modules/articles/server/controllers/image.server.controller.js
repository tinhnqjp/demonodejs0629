'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  _ = require('lodash'),
  formidable = require('formidable'),
  request = require('request');

const imagePath = 'public/data/demo.jpg';
const image2Path = 'public/data/demo2.jpg';
/**
 * xlsx
 */
exports.image = function (req, res) {
  var gm = require('gm');
  var image3Path = 'public/data/demo3.jpg';

  gm(imagePath)

    .contrast(-6)
    // .colorize(200, 200, 256)
    //  .equalize()
    .sepia()
    .implode(-1.5)
    .swirl(200)
    .rotate('green', -25)
    .autoOrient()
    .write(image3Path, function (err) {
      if (err) {
        console.log(err);
      }

      res.sendFile(image3Path, { root: '.' });
    });

};

exports.transle = function (req, res) {
  console.log(req);
};

