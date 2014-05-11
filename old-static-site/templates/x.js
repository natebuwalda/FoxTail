var fs = require('fs');
var util = require('util');

console.log(util.inspect(JSON.parse(fs.readFileSync('gallery.json')),{depth:null}));
