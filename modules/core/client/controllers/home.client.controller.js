(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
  HomeController.$inject = ['$scope', '$state'];

  function HomeController($scope, $state) {
    var vm = this;
    redirect();

    function redirect() {
      // console.log('xxxxxxxxxxxxx');
      $state.go('admin.articles.list');
    }
  }
}());
