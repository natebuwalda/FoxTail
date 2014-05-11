'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  id: String,
  title: String,
  link: String,
  desc: String,
  img: String,
  price: String
});

mongoose.model('Product', ProductSchema);
