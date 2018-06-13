'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Article = mongoose.model('Article'),
  Chart = mongoose.model('Chart'),
  Excel = mongoose.model('Excel'),
  MasterCheckSheetForm7 = mongoose.model('MasterCheckSheetForm7'),
  ExcelJs = require('exceljs'),
  XLSXChart = require('xlsx-chart'),
  ChartjsNode = require('chartjs-node'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * copy an article
 */
exports.copy = function (req, res) {
  var article = req.article;
  var newArticle = new Article();
  _.extend(newArticle, {
    title: article.title + ' - コピー',
    content: article.content
  });
  newArticle.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(newArticle);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  var limit = Number(req.query.limit) || 10;
  var page = Number(req.query.page) || 1;
  var keyword = req.query.keyword || null;
  var condition = {};
  if (keyword) {
    var regex = new RegExp(keyword.trim(), 'i');
    condition = { $or: [
      { 'title': regex },
      { 'content': regex }
    ] };
  }

  Article.find(condition)
    .skip((limit * page) - limit)
    .limit(limit)
    .sort('-created').populate('user', 'displayName').exec(function (err, articles) {
      Article.count(condition).exec(function (err, count) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json({
            laws: articles,
            current: page,
            total: count
          });
        }
      });
    });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};

exports.printer = function (req, res) {
  var Printer = require('node-printer');
  var options = {
    media: 'Custom.200x600mm',
    n: 3
  };

  // Get available printers list
  var out = Printer.list();
  console.log(out);
  res.send({});
};

exports.form7 = function (req, res) {
  // init
  const templateFilePath = 'public/data/template.xlsx';
  const outputFileName = 'public/data/out.xlsx';
  const logoFileName = 'public/data/logo.png';
  const chartFileName = 'public/data/chart.xlsx';
  var workbook = new ExcelJs.Workbook();
  var listDataForm7,
    listTable1,
    listTable2,
    listTable3,
    listTable4;

  // process
  MasterCheckSheetForm7.getTable()
    .then(function (dataForm7) {
      listDataForm7 = dataForm7;
      listTable1 = _.filter(listDataForm7, { table: 1 });
      listTable2 = _.filter(listDataForm7, { table: 2 });
      listTable3 = _.filter(listDataForm7, { table: 3 });
      listTable4 = _.filter(listDataForm7, { table: 4 });

      return workbook.xlsx.readFile(templateFilePath);
    })
    .then(function () {
      workbook.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
      ];

      var worksheet = workbook.getWorksheet('Template');

      worksheet.getCell('E2').value = '物件名　： 青木様邸　新築工事';
      worksheet.getCell('E3').value = '第　 JAIC2017X0005A1　　号';
      worksheet.mergeCells('E2:G2');
      worksheet.mergeCells('E3:G3');
      var borderHeader = {
        bottom: { style: 'medium', color: { argb: '000000' } }
      };
      var fontHeader = { name: '游ゴシック', size: 9, bold: true };
      worksheet.getCell('E2').border = borderHeader;
      worksheet.getCell('E3').border = borderHeader;
      worksheet.getCell('E2').font = fontHeader;
      worksheet.getCell('E3').font = fontHeader;
      // add row

      // Add a row by contiguous Array (assign to columns A, B & C)
      worksheet.getColumn(1).width = 25;
      worksheet.getColumn(2).width = 25;
      worksheet.getColumn(3).width = 25;
      worksheet.getColumn(4).width = 25;
      worksheet.getColumn(5).width = 40;
      worksheet.getColumn(6).width = 5;
      worksheet.getColumn(7).width = 5;

      var rowStart = 6;
      var rowEnd = Excel.createTableForm(workbook, listTable1, rowStart, '（共通事項）');

      rowStart = rowEnd;
      rowEnd = Excel.createTableForm(workbook, listTable2, rowStart, '（木造の場合）');

      rowStart = rowEnd;
      rowEnd = Excel.createTableForm(workbook, listTable3, rowStart, '（鉄骨造の場合）');

      rowStart = rowEnd;
      rowEnd = Excel.createTableForm(workbook, listTable4, rowStart, '（鉄筋コンクリート造の場合）');
      // add row
      // worksheet.addImage(Excel.image(logoFileName, workbook), 'B2:C3');
      // random data
      // var array = [];
      // for (let index = 9; index <= 25; index++) {
      //   var _random = random();
      //   worksheet.getCell(colG + index).value = _random;
      //   array.push(_random);
      // }

      var data = {
        labels: ['red', 'orange', 'yellow', 'green', 'blue'],
        datasets: [{
          label: 'Compras',
          backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          data: [random(), random(), random(), random(), random()]
        }
        ]
      };
      // random data

      return Chart.exportChart(data);
    })
    .then(function (imagePath) {
      var worksheet = workbook.getWorksheet('Template');
      // worksheet.addImage(Excel.image(imagePath, workbook), 'B3:H8');

      return workbook.xlsx.writeFile(outputFileName);
    })
    .then(function () {
      console.info('**OK**');

      // console.log(json.item1);
      res.send({});
      // res.download(outputFileName);
    })
    .catch(function (error) {

      console.error('**ERROR**', error);
      return res.status(422).send({
        message: error
      });
    });
};

function random() {
  return Math.floor((Math.random() * 10) + 1);
}
