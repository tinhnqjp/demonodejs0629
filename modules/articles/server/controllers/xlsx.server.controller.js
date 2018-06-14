'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  MasterCheckSheetForm7 = mongoose.model('MasterCheckSheetForm7'),
  _ = require('lodash'),
  XLSX = require('XLSX'),
  formidable = require('formidable'),
  request = require('request');

/**
 * xlsx
 */
exports.sheetjs = function (req, res) {
  // init
  const templateFilePath = 'public/data/template2.xlsx';
  const outputFileName = 'public/data/out.xlsx';
  /* read the file */
  var workbook = XLSX.readFile(templateFilePath); // parse the file
  XLSX.writeFile(workbook, outputFileName);

  res.send({});
}
