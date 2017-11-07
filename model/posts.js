const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

let PostsSchema = new Schema ({
  author: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  body: {
      type: String,
      minlength: AppConstants.BODY_MIN_LENGTH,
      maxlength: AppConstants.BODY_MAX_LENGTH
    },
    createAt: {
      type: Date,
      default: Date.now,
      index: true
    //post_Type:{
      //required: true,
    //  type: String
    },
    comments: [{
      type: String
      }],
    shares: [{
      type: String
      }],
    tags: [{
      type: String,
      }],
    likes: [{
      type: String,
      }]
});
//PostsSchema.index({createAt:-1});
module.exports = mongoose.model('posts', PostsSchema);
