(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService).factory('ArticlesApi', ArticlesApi);

  ArticlesService.$inject = ['$resource', '$log'];

  function ArticlesService($resource, $log) {
    var Article = $resource('/api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    return Article;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }

  ArticlesApi.$inject = ['$http'];
  function ArticlesApi($http) {
    this.copy = function (articleId) {
      return $http.post('/api/articles/' + articleId + '/copy', null, { ignoreLoadingBar: true });
    };
    this.download = function (json) {
      return $http.post('/api/excelandpdf', json, { ignoreLoadingBar: true });
    };
    return this;
  }

}());
