'use strict';

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var Product = mongoose.model('Product');
var Busboy = require('busboy');
var inspect = require('util').inspect;
var temp = require('temp');
var csv = require('csv');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var simple_recaptcha = require('simple-recaptcha');
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");
var path = require('path');
var glob = require('glob');
var stripAnsi = require('strip-ansi');

var wd;
var getWd = function (env) {
  if(env === "development") {
    return __dirname + "/../..";
  } else {
    return __dirname + "/../../..";
  }
};

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
  return Product.find({}, {}, {sort: 'ID'}, function (err, products) {

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
 * Process contact form.
 */
exports.contact = function (req, res) {
  var privateKey = '6LcAau8SAAAAAF1VhxGbcGEJm07o3QX_kgNqctgo'; // global-key.foxtail-artisanry.com
  var ip = req.headers['x-forwarded-for'] || req.ip;
  var challenge = req.body.challenge;
  var response = req.body.response;

  var name = req.body.name;
  var msg = 'Request from IP: ' + ip + "\nName: " + req.body.name + "\nEmail: " + req.body.email + "\n\nMessage:\n" + req.body.message;
  var mailOptions = {
    //to: 'foxtailartisanry@gmail.com',
    to: 'foxtailartisanry@gmail.com',
    bcc: 'foxtailartisanry@cfxmusic.com',
    from: req.body.name + ' <' + req.body.email + '>',
    subject: 'Foxtail Webform - ' + name,
    text: msg
  };

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {
    if (err) return res.send(406, 'RECAPTCHA ' + err.message);
    mailTransport.sendMail(mailOptions, function (err) {
      if (err) return res.send(500, 'RECAPTCHA ' + err.message);
      res.send(200,'message sent.');
    });
  });

};

/**
 * Update website via 'git pull'.
 */
exports.updateWebsite = function (req, res) {
  res.send(200);
  var myProcess = spawn('git', ['pull'], {cwd: getWd(req.mode), env: {GIT_SSH: "./pull-git.sh"}});

  myProcess.stdout.setEncoding('utf-8');
  myProcess.stdout.on('data', function (data) {
    console.log('stdout/',data);
    req.io.sockets.emit('console', stripAnsi(data));
  });
  
  myProcess.stderr.setEncoding('utf-8');
  myProcess.stderr.on('data', function (data) {
    console.log('stderr/',data);
    req.io.sockets.emit('console', stripAnsi(data));
  });

  // myProcess.on('close', function (code) {
  //   if (code !== 0) {
  //     res.send(500, "ERROR: The pull request failed.");
  //   }

  //   res.send(200, "Process [website pull] finished successfully.");
  // });
};

/**
 * Rebuild website via 'grunt build'.
 */
exports.buildWebsite = function (req, res) {
  res.send(200);
  var myProcess = spawn('./grunt', ['build'], {cwd: getWd(req.mode)});

  myProcess.stdout.setEncoding('utf-8');
  myProcess.stdout.on('data', function (data) {
    console.log('stdout/',data);
    req.io.sockets.emit('console', stripAnsi(data));
  });
  
  myProcess.stderr.setEncoding('utf-8');
  myProcess.stderr.on('data', function (data) {
    console.log('stderr/',data);
    req.io.sockets.emit('console', stripAnsi(data));
  });

  // myProcess.on('close', function (code) {
  //   if (code !== 0) {
  //     res.send(500, "ERROR: The build request failed.");
  //   }

  //   res.send(200, "Process [build] finished successfully.");
  // });
};

/**
 * Restart website by ending the process.
 */
exports.stopWebsite = function (req, res) {
  res.send(200);
  process.exit(0);
};

/**
 * Accept database file
 */
exports.acceptFile = function (req, res) {
  console.log('acceptFile for',req.user || null);
  temp.track();

  var parseFile = function(filename) {
    console.log("Trying to parse",filename,'...');

    Product.find().remove().exec(function () {

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
        //console.dir(upsertData);
        ['IMG-Thumb','IMG-01','IMG-02','IMG-03','IMG-04','IMG-05','IMG-06','IMG-07','IMG-08','IMG-09','IMG-10'].forEach(function (type) {
          var imgpath = {};
          imgpath.dir = path.dirname(upsertData[type]);
          imgpath.file = path.basename(upsertData[type]);
          var searchPath = path.resolve(__dirname+'../../../public/'+imgpath.dir);
          console.log(searchPath);
          var globpath = searchPath+'/*.'+imgpath.file;
          var matches = glob.sync(globpath);
          console.log('-- Searching for image \''+imgpath.file+'\' in \''+searchPath+'\' via \''+globpath+'\'...'); 
          if(typeof matches[0] !== 'undefined') {
            var newpath = imgpath.dir + '/' + path.basename(matches[0]);
            console.log('-- Rewriting image path \''+upsertData[type]+'\' to \''+newpath+'\'...'); 
            upsertData[type] = newpath;
          }

          Product.update({ID: upsertData.ID}, upsertData, {upsert: true}, function (err, numberAffected, raw) {
            if (err) return console.error(err);
            console.log('The number of updated documents was %d', numberAffected);
            console.log('The raw response from Mongo was ', raw);
          });
        });

      })
      .on('error', function(error){
        console.log(error.message);
      })
      .on('end', function () {
        //console.dir(temp.cleanup());
      });
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
