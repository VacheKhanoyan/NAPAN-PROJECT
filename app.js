const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
//const multer = require('multer');
//const fs = require('fs');
//const path = require('path');
const app = express();

const Utility = require('./services/utility');
const AppConstants = require('./settings/constants');
require('./model/users');
require('./model/posts');
require('./model/images');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended:true
}));

app.use(Utility.parseQuery);

const con = mongoose.createConnection(AppConstants.DB_URL);

app.db = {
  users: con.model('users'),
  posts: con.model('posts'),
  images: con.model('images')
}
require ('./controller/api')(app);

app.listen(3004);
