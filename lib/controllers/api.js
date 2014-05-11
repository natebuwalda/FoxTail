'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Product = mongoose.model('Product');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get all products
 */
exports.products = function(req, res) {
  return Product.find(function (err, products) {
    if (!err) {
      return res.json(products);
    } else {
      return res.send(err);
    }
  });
};