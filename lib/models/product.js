'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  'ID': { type: String, index: true},
  'Category': String,
  'Title': String,
  'Material': String,
  'Reg-Price-Large': String,
  'Sale-Price-Large': String,
  'Stock-Large': String,
  'Reg-Price-Medium': String,
  'Sale-Price-Medium': String,
  'Stock-Medium': String,
  'Reg-Price-Small': String,
  'Sale-Price-Small': String,
  'Stock-Small': String,
  'Short-Desc': String,
  'Long-Desc': String,
  'URL-Etsy': String,
  'URL-Goodsmiths': String,
  'URL-Square': String,
  'IMG-Thumb': String,
  'IMG-01': String,
  'IMG-02': String,
  'IMG-03': String,
  'IMG-04': String,
  'IMG-05': String,
  'IMG-06': String,
  'IMG-07': String,
  'IMG-08': String,
  'IMG-09': String,
  'IMG-10': String
});

mongoose.model('Product', ProductSchema);
