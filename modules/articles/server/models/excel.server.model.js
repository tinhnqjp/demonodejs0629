'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  fs = require('fs'),
  path = require('path'),
  ChartjsNode = require('chartjs-node'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Article Schema
 */
var Excel = new Schema();

Excel.statics.image = function (fileName, workbook) {
  var imageLogo = workbook.addImage({ buffer: fs.readFileSync(fileName), extension: 'png' });
  return imageLogo;
};

// masterCheckSheetForm7 creating table
function mergeItem(startCol, endCol, rsp, indexRow) {
  if (rsp > 0) {
    rsp = rsp - 1;
  }
  return startCol + indexRow + ':' + endCol + (indexRow + rsp);
}

var colA = 'A',
  colB = 'B',
  colC = 'C',
  colD = 'D',
  colE = 'E',
  colF = 'F',
  colG = 'G';
var borderTable = {
  top: { style: 'thin', color: { argb: '000000' } },
  bottom: { style: 'thin', color: { argb: '000000' } },
  right: { style: 'thin', color: { argb: '000000' } },
  left: { style: 'thin', color: { argb: '000000' } }
};
var fontTableHeader = {
  name: 'ＭＳ 明朝',
  size: 10,
  bold: true
};
var fontTableBody = {
  name: 'ＭＳ 明朝',
  size: 9,
  bold: false
};
var alignmentTableBody = { vertical: 'top', wrapText: true };
var alignmentColCheck = { vertical: 'top', horizontal: 'center' };
var alignmentTableHeader = { vertical: 'middle', horizontal: 'center', wrapText: true };

function setCell(worksheet, colRow, value, border = false, font = false, alignment = false) {
  worksheet.getCell(colRow).value = value;
  // borderTable, fontTableBody, alignmentTableBody
  worksheet.getCell(colRow).border = border || borderTable;
  worksheet.getCell(colRow).font = font || fontTableBody;
  worksheet.getCell(colRow).alignment = alignment || alignmentTableBody;
}

/**
 * Create header
 * @param {*} workbook workbook
 * @param {*} numRowStart number row start
 * @param {*} title title
 */
function createTableHeader(workbook, numRowStart, title) {
  var worksheet = workbook.getWorksheet('Template');
  var numRow = numRowStart + 1;
  var numRow2 = numRow + 1;
  // title
  worksheet.getCell(colA + numRowStart).value = title;
  // row 1
  setCell(worksheet, colA + numRow, '（い）', borderTable, fontTableHeader, alignmentTableHeader);
  setCell(worksheet, colF + numRow, '（ろ）', borderTable, fontTableHeader, alignmentTableHeader);
  worksheet.mergeCells(mergeItem(colA, colE, 0, numRow));
  worksheet.mergeCells(mergeItem(colF, colG, 0, numRow));
  // row 2
  setCell(worksheet, colA + numRow2, '備考', borderTable, fontTableHeader, alignmentTableHeader);
  setCell(worksheet, colE + numRow2, '検査事項', borderTable, fontTableHeader, alignmentTableHeader);
  setCell(worksheet, colF + numRow2, '目視検査', borderTable, fontTableHeader, alignmentTableHeader);
  worksheet.mergeCells(mergeItem(colA, colD, 0, numRow2));
  worksheet.mergeCells(mergeItem(colF, colG, 0, numRow2));
}

/**
 * Create footer
 * @param {*} workbook workbook
 * @param {*} numRow number row start
 */
function createTableFooter(workbook, numRow) {
  var worksheet = workbook.getWorksheet('Template');
  var borderTableFooter = {
    top: { style: 'medium', color: { argb: '000000' } },
    bottom: { style: 'medium', color: { argb: '000000' } },
    right: { style: 'medium', color: { argb: '000000' } },
    left: { style: 'medium', color: { argb: '000000' } }
  };
  setCell(worksheet, colA + numRow, '備考', borderTableFooter, fontTableHeader, alignmentTableBody);
  worksheet.mergeCells(mergeItem(colA, colG, 5, numRow));
}

/**
 * Create body table from data
 * @param {*} workbook workbook
 * @param {*} listDataForm7 datalist
 * @param {*} rowStart number row start
 */
Excel.statics.createTableForm = function (workbook, listDataForm7, rowStart, title) {
  // create header
  createTableHeader(workbook, rowStart, title);
  rowStart = rowStart + 3;
  var worksheet = workbook.getWorksheet('Template');
  // for data
  listDataForm7.forEach(function (item, index) {
    var indexRow = (index + rowStart);
    // A ~ D
    if (item.item3) {

      if (item.rsp_item1 >= 0) {
        worksheet.mergeCells(mergeItem(colA, colA, item.rsp_item1, indexRow));
        setCell(worksheet, colA + indexRow, item.item1);
      }

      if (item.rsp_item2 >= 0) {
        worksheet.mergeCells(mergeItem(colB, colB, item.rsp_item2, indexRow));
        setCell(worksheet, colB + indexRow, item.item2);
      }

      if (item.rsp_item3 >= 0) {
        worksheet.mergeCells(mergeItem(colC, colC, item.rsp_item3, indexRow));
        setCell(worksheet, colC + indexRow, item.item3);
      }

      if (item.rsp_item4 >= 0) {
        worksheet.mergeCells(mergeItem(colD, colD, item.rsp_item4, indexRow));
        setCell(worksheet, colD + indexRow, item.item4);
      }
    } else if (item.item2) {
      if (item.rsp_item1 >= 0) {
        worksheet.mergeCells(mergeItem(colA, colA, item.rsp_item1, indexRow));
        setCell(worksheet, colA + indexRow, item.item1);
      }

      if (item.rsp_item2 >= 0) {
        worksheet.mergeCells(mergeItem(colB, colC, item.rsp_item2, indexRow));
        setCell(worksheet, colB + indexRow, item.item2);
      }

      if (item.rsp_item4 >= 0) {
        worksheet.mergeCells(mergeItem(colD, colD, item.rsp_item4, indexRow));
        setCell(worksheet, colD + indexRow, item.item4);
      }
    } else if (item.item4) {
      if (item.rsp_item1 >= 0) {
        worksheet.mergeCells(mergeItem(colA, colC, item.rsp_item1, indexRow));
        setCell(worksheet, colA + indexRow, item.item1);
      }

      if (item.rsp_item4 >= 0) {
        worksheet.mergeCells(mergeItem(colD, colD, item.rsp_item4, indexRow));
        setCell(worksheet, colD + indexRow, item.item4);
      }
    } else {
      if (item.rsp_item1 >= 0) {
        worksheet.mergeCells(mergeItem(colA, colD, item.rsp_item1, indexRow));
        setCell(worksheet, colA + indexRow, item.item1);
      }
    }
    // E ~ G
    setCell(worksheet, colE + indexRow, item.legal_text);

    worksheet.mergeCells(mergeItem(colF, colG, 0, indexRow));
    setCell(worksheet, colF + indexRow, '-', borderTable, fontTableBody, alignmentColCheck);
  });
  createTableFooter(workbook, rowStart + listDataForm7.length);

  var row = worksheet.lastRow;
  row.addPageBreak();
  return rowStart + listDataForm7.length + 5;
};

// masterCheckSheetForm7
mongoose.model('Excel', Excel);
