var simple_recaptcha = require('simple-recaptcha');
var nodemailer = require('nodemailer');
var winston = require('winston');
var express = require('express');
var app = express();

var PORT=4000;
var mailTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: 'debug', timestamp: true}),
    //new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});

var winstonStream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

logger.setLevels(winston.config.syslog.levels);
app.use(express.urlencoded());
app.use(express.logger({stream: winstonStream}));

app.post('/data/contact', function(req, res) {

  console.log('f');
  console.dir(req.body);
  var privateKey = '6LcAau8SAAAAAF1VhxGbcGEJm07o3QX_kgNqctgo'; // global-key.foxtail-artisanry.com
  var ip = req.headers['x-forwarded-for'];
  var challenge = req.body.recaptcha_challenge_field;
  var response = req.body.recaptcha_response_field;

  var name = req.body.name;
  var msg = 'Request from IP: ' + ip + "\nName: " + req.body.name + "\nEmail: " + req.body.email + "\n\nMessage:\n" + req.body.message;
  var mailOptions = {
    to: 'foxtailartisanry@gmail.com',
    from: req.body.name + ' <' + req.body.email + '>',
    subject: 'Foxtail Webform - ' + name,
    text: msg
  }

  simple_recaptcha(privateKey, ip, challenge, response, function(err) {
    if (err) return res.send(err.message);
    mailTransport.sendMail(mailOptions, function (err) {
      if (err) return res.send(err.message);
      res.send('message sent');
    });
  });
});

app.listen(PORT);
logger.notice('== Started FoxTail Data Server on port',PORT);
