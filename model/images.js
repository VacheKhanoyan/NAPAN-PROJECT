const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

let ImagesSchema = new Schema ({
  author: {
      type: Schema.ObjectId,
      intex: true,
      ref: 'users'
    },
    images: {
      type: Buffer,
      default: null,
      },
    content_type:{
      type: String,
      },
    createAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    size: {
      type: Number
    },
    width: {
      type: Number
    },
    heigth: {
      type: Number
    },
    title:{
      type: String
    },
});

module.exports = mongoose.model('images', ImagesSchema);
