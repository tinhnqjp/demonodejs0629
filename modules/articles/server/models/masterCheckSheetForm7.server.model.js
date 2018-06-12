'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Article Schema
 */
var MasterCheckSheetForm7 = new Schema();

MasterCheckSheetForm7.statics.getTable = function (_table) {
  var conditon = {};
  if (_table) {
    conditon = { table: _table };
  }
  var MasterCheckSheetForm7 = mongoose.model('MasterCheckSheetForm7');
  return MasterCheckSheetForm7.find(conditon).lean().sort('-created').exec();
};

// masterCheckSheetForm7
mongoose.model('MasterCheckSheetForm7', MasterCheckSheetForm7, 'masterCheckSheetForm7');
