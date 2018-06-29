(function () {
  'use strict';

  angular
    .module('cards.admin')
    .controller('PlayAdminController', PlayAdminController);

  PlayAdminController.$inject = ['$scope', 'CardsService', 'CardsApi'];
  function PlayAdminController($scope, CardsService, CardsApi) {
    var vm = this;
    vm.form = {};
    $scope.currentPage = 1;
    $scope.isFlipped = [];
    $scope.listQuestion = [];
    initData();

    function initData() {
      CardsApi.play()
      .then(function (res) {
        $scope.listQuestion = res.data;
      });
    };

    $scope.flipped = function () {
      if ($scope.isFlipped[$scope.currentPage]) {
        $scope.isFlipped[$scope.currentPage] = false;
      } else {
        $scope.isFlipped[$scope.currentPage] = true;
      }
    };
    $scope.next = function () {
      if ($scope.currentPage < $scope.listQuestion.length) {
        $scope.currentPage++;
      }
    };
    $scope.prev = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
      }
    };

    $scope.sayIt = function () {
      var text = $scope.listQuestion[$scope.currentPage - 1].front;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };

    $scope.keypress = function ($event) {
      if ($event.keyCode === 38)
        $scope.flipped();
      else if ($event.keyCode === 39)
        $scope.next();
      else if ($event.keyCode === 40)
        $scope.flipped();
      else if ($event.keyCode === 37)
        $scope.prev();
    };
  }
}());
