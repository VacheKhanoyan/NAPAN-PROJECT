const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const Utility = require('./services/utility');
const AppConstants = require('./settings/constants');
const ChekAPIKey = require('./model/user');
ChekAPIKey.isAutorisated = (rea,res,next) =>{
  req.isAutorisated()?next():ChekAPIKey.generateAPIKey()
} // I dont know is it near a true ??
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended:true
}));


app.use(Utility.parseQuery);

const con = mongoose.createConnection(AppConstants.DB_URL);

app.db = {
  users: con.model('users')
}
require ('./controller/api')(app);

app.listen(3004);
