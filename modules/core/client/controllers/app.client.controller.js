'use strict';

angular.module('core').controller('AppController', AppController);

AppController.$inject = ['$scope', '$timeout', '$window', 'Authentication', 'notifyService', 'ngDialog'];

function AppController($scope, $timeout, $window, Authentication, notifyService, ngDialog) {
  $scope.Authentication = Authentication;
  $scope.handleShowConfirm = handleShowConfirm;
  $scope.handleShowDownload = handleShowDownload;
  $scope.nofitySuccess = nofitySuccess;
  $scope.nofityError = nofityError;
  $scope.exportExcel = exportExcel;
  $scope.getDataRoles = getDataRoles;
  $scope.range = function (min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  };

  // modal confirm
  function handleShowConfirm(content, resolve, reject) {
    $scope.dialog = content;
    ngDialog.openConfirm({
      templateUrl: 'confirmTemplate.html',
      scope: $scope
    }).then(function (res) {
      delete $scope.dialog;
      if (resolve) {
        resolve(res);
      }
    }, function (res) {
      delete $scope.dialog;
      if (reject) {
        reject(res);
      }
    });
  }

  function handleShowDownload(dialog, resolve, reject) {
    $scope.dialog = dialog;
    $scope.dialog.isSaveOrOpenBlob = false;
    if (window.navigator.msSaveOrOpenBlob) {
      $scope.dialog.isSaveOrOpenBlob = true;
    }

    ngDialog.openConfirm({
      templateUrl: 'downloadTemplate.html',
      scope: $scope
    }).then(function (res) {
      if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([dialog.href], {
          type: 'application/csv;charset=utf-8;'
        });
        window.navigator.msSaveOrOpenBlob(blob, dialog.file);
      }

    }, function (res) {
      delete $scope.dialog;
      if (reject) {
        reject(res);
      }
    });
  }

  function nofitySuccess(message) {
    return notifyService.success(message);
  }

  function nofityError(message) {
    return notifyService.error(message);
  }

  function exportExcel(tableId, sheetName) {
    return Excel.tableToExcel(tableId, sheetName);
  }

  function getDataRoles() {
    var dataRoles = [];
    if ($scope.Authentication.user && $scope.Authentication.user.roles[0] === 'admin') {
      dataRoles = [{
        id: 'admin',
        name: 'SYSTEM'
      },
      {
        id: 'jaic',
        name: 'JAIC'
      },
      {
        id: 'user',
        name: '一般'
      }
      ];
    }
    if ($scope.Authentication.user && $scope.Authentication.user.roles[0] === 'jaic') {
      dataRoles = [{
        id: 'jaic',
        name: 'JAIC'
      },
      {
        id: 'user',
        name: '一般'
      }
      ];
    }
    return dataRoles;
  }

}
