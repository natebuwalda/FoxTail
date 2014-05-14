'use strict';

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var Product = mongoose.model('Product');
var Busboy = require('busboy');
var inspect = require('util').inspect;
var temp = require('temp');
var csv = require('csv');
var exec = require('child_process').exec;

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

exports.product = function (req, res) {
  var productId = req.params.id;

  return Product.findOne({ID: productId}, function (err, product) {
    if (!err) {
      return res.json(product);
    }

    return res.send(err);
  });
};

/**
 * Report product count
 */
exports.numProducts = function (req, res) {
  Product.count({}, function(err, count) {
    if (err) return res.send(500, err);
    res.json({numProducts: count});
  });
};

/**
 * Update website via 'git pull'.
 */
exports.updateWebsite = function (req, res) {
  console.log("Execution directory:" + __dirname);
  exec("git pull", {cwd: __dirname + "/../..", env: {GIT_SSH: "./pull-git.sh"}}, function (error, stdout, stderr) {
    if (error) return res.send(500, "ERROR: [" + error + "] The pull request failed. (" + stderr + ") / out: " + stdout);

    res.send(200, stdout);
  });
};

/**
 * Accept database file
 */
exports.acceptFile = function (req, res) {
  console.log('acceptFile for',req.user || null);
  temp.track();

  var parseFile = function(filename) {
    console.log("Trying to parse",filename,'...');

    csv()
    .from.path(filename, {delimiter: ',', header: true})
    .on('record', function(row, index) {
      if(index === 0) return;
      console.log('-------------------');
      // console.log('index:',index,'record:');
      // console.dir(row,index);

      var product = new Product({
        'ID': row[0],
        'Category': row[1],
        'Title': row[2],
        'Material': row[3],
        'Reg-Price-Large': row[4],
        'Sale-Price-Large': row[5],
        'Stock-Large': row[6],
        'Reg-Price-Medium': row[7],
        'Sale-Price-Medium': row[8],
        'Stock-Medium': row[9],
        'Reg-Price-Small': row[10],
        'Sale-Price-Small': row[11],
        'Stock-Small': row[12],
        'Short-Desc': row[13],
        'Long-Desc': row[14],
        'URL-Etsy': row[15],
        'URL-Goodsmiths': row[16],
        'URL-Square': row[17],
        'IMG-Thumb': row[18],
        'IMG-01': row[19],
        'IMG-02': row[20],
        'IMG-03': row[21],
        'IMG-04': row[22],
        'IMG-05': row[23],
        'IMG-06': row[24],
        'IMG-07': row[25],
        'IMG-08': row[26],
        'IMG-09': row[27],
        'IMG-10': row[28]
      });

      var upsertData = product.toObject();
      delete upsertData._id;
      console.dir(upsertData);

      Product.update({ID: upsertData.ID}, upsertData, {upsert: true}, function (err, numberAffected, raw) {
        if (err) return console.error(err);
        console.log('The number of updated documents was %d', numberAffected);
        console.log('The raw response from Mongo was ', raw);
      });
    })
    .on('error', function(error){
      console.log(error.message);
    })
    .on('end', function () {
      //console.dir(temp.cleanup());
    });
  };

  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var tempfile = temp.createWriteStream();
    file.pipe(tempfile);

    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
      setImmediate(function () { parseFile(tempfile.path); });
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
