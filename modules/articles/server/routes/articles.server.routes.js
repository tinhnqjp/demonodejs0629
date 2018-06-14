'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller'),
  xlsx = require('../controllers/xlsx.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  app.route('/api/articles/:articleId/copy')
    .post(articles.copy);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);

  app.route('/api/form7').get(articles.form7);
  app.route('/api/sheetjs').get(xlsx.sheetjs);
  app.route('/api/sheetjs').post(xlsx.sheetjs);
  app.route('/api/printer').get(articles.printer);
};
