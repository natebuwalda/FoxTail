'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    admin = require('./controllers/admin'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  app.route('/api/products/total')
    .get(api.numProducts);
  app.route('/api/products')
    .get(api.products);
  app.route('/api/product/:id')
    .get(api.product);
  app.route('/api/contact')
    .post(api.contact);
  
  app.route('/api/updateWebsite')
    .get(middleware.auth, api.updateWebsite);

  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/api/acceptFile')
    .post(middleware.auth, api.acceptFile);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  app.route('/admin/partials/*')
    .get(function () { console.log('Canadians!'); admin.partials(); } );
  app.route('/admin').get(function (req, res) { res.redirect('/admin/login'); });
  app.route('/admin/').get(function (req, res) { res.redirect('/admin/login'); });
  app.route('/admin/?*')
     .get( middleware.setUserCookie, admin.index, function() { console.log("... mommy?!");} );
 
  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};