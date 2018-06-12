(function () {
  'use strict';

  angular
    .module('core')
    .factory('Excel', Excel);

  Excel.$inject = ['$window'];

  function Excel($window) {
    var uri = 'data:application/vnd.ms-excel;text/html;charset=UTF-8;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
      ' xmlns:html="http://www.w3.org/TR/html401" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><head></head><body><table>{table}</table>' +
      '</body></html>',
      base64 = function (s) {
        return $window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };

    return {
      tableToExcel: function (tableId, worksheetName) {
        var exTable = $(tableId).clone();
        // remove the action th/td
        exTable.find('.ignore-excel-export').remove();
        var ctx = {
          worksheet: worksheetName,
          table: exTable.html()
        };

        if (window.navigator.msSaveOrOpenBlob) {
          return format(template, ctx);
        } else {
          return uri + base64(format(template, ctx));
        }
      }
    };
  }
}());
