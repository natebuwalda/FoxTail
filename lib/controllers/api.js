'use strict';

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var Product = mongoose.model('Product');
var Busboy = require('busboy');
var inspect = require('util').inspect;

/**
 * Get awesome things
 */
exports.awesomeThings = function (req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    }

    return res.send(err);
  });
};

/**
 * Get all products
 */
exports.products = function (req, res) {
  return Product.find(function (err, products) {
    if (!err) {
      return res.json(products);
    }

    return res.send(err);
  });
};

/**
 * Accept database file
 */
exports.acceptFile = function (req, res) {
  console.log('acceptFile for',req.user || null);

  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });
  busboy.on('finish', function() {
    console.log('Done parsing form!');
    res.send(200);
  });
  req.pipe(busboy);
};