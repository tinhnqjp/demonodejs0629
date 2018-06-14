(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService', 'ArticlesApi', '$scope', '$state', '$window', 'Authentication'];

  function ArticlesAdminListController(ArticlesService, ArticlesApi, $scope) {
    var vm = this;
    vm.currentPage = 1;
    vm.pageSize = 5;
    vm.offset;
    vm.articles = [];
    
    initData();

    function initData() {
      vm.offset = (vm.currentPage - 1) * vm.pageSize;
      var input = { page: vm.currentPage, limit: vm.pageSize, keyword: vm.keyword };
      // console.log(input);
      ArticlesService.get(input, function (output) {
        vm.articles = output.laws;
        vm.totalItems = output.total;
        vm.currentPage = output.current;
      });
    }

    vm.pageChanged = function () {
      initData();
    };

    vm.search = function () {
      initData();
    };

    vm.remove = function (_article) {
      $scope.handleShowConfirm({
        message: 'この法令を削除します。よろしいですか？'
      }, function () {
        vm.busy = true;
        var article = new ArticlesService({
          _id: _article._id
        });
        article.$remove(function () {
          vm.busy = false;
          initData();
          $scope.nofitySuccess('法令データの削除が完了しました。');
        });
      });
    };

    vm.copy = function (_article) {
      $scope.handleShowConfirm({
        message: 'この法令データをコピーします。よろしいですか？'
      }, function () {
        vm.busy = true;
        ArticlesApi.copy(_article._id)
          .then(function (res) {
            vm.busy = false;
            initData();
            $scope.nofitySuccess('法令データのコピーが完了しました。');
          })
          .catch(function (res) {
            vm.busy = false;
            $scope.nofityError('法令データのコピーが失敗しました。');
          });
      });
    };
  }
}());
