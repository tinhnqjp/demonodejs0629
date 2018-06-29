'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  mysql = require('mysql'),
  fs = require('fs'),
  MasterCheckSheetForm7 = mongoose.model('MasterCheckSheetForm7'),
  _ = require('lodash'),
  ExcelJs = require('exceljs'),
  Excel = mongoose.model('Excel'),
  formidable = require('formidable'),
  request = require('request');

/**
 * xlsx
 */
exports.sheetjs = function (req, res) {
  // init
  res.send({});
};

exports.excelandpdf = function (req, res) {
  var json = req.body;
  console.log(json);
  var name = Date.now();
  // init
  const templateFilePath = 'public/data/template.xlsx';
  const outputExcelFileName = 'public/data/excel/' + name.toString() + '.xlsx';
  const outputFdfFileName = 'public/data/excel/' + name.toString() + '.pdf';
  var workbook = new ExcelJs.Workbook();
  var listDataForm7,
    listTable1,
    listTable2,
    listTable3,
    listTable4,
    totalMysql;

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
    .then(function (dataForm7) {
      var query_from = ' FROM nice_property_info_1';
      var query_total = 'SELECT count(*) as total' + query_from;
      return mysqlSelect(query_total);
    })
    .then(function (result_total) {
      totalMysql = result_total[0].total;
      workbook.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
      ];

      var worksheet = workbook.getWorksheet('Template');
      worksheet.getCell('A2').value = 'TOTAL DATA FROM MYSQL: ' + totalMysql;
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
    })
    .then(function () {
      return workbook.xlsx.writeFile(outputExcelFileName);
    })
    .then(function () {
      // var unoconv = require('unoconv');
      // unoconv.convert(outputExcelFileName, 'pdf', {}, function (err, result) {
      // result is returned as a Buffer
      // fs.writeFile(outputFdfFileName, result);
      // });
    })
    .then(function () {
      res.json({ file: outputExcelFileName });
    })
    .catch(function (error) {
      console.error('**ERROR**', error);
      return res.status(422).send({
        message: error
      });
    });
};

function mysqlSelect(query, param) {
  var pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'localhost',
    user: 'jaic',
    password: 'phHMsxf@2',
    database: 'jaic_db'
  });
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
    });

    pool.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId);
    });

    pool.on('enqueue', function () {
      console.log('Waiting for available connection slot');
    });

    pool.query(query, param, function (error, results, fields) {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
}
