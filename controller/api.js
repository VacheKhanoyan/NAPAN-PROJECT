const crypto = require('crypto');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user-validator');
const EmailValidator = require('./../services/validators/email-validator');
const ET = Utility.ErrorTypes;

module.exports = function(app) {
  function _auth(permission) {
    return function (req, res, next){
    if(permission == 'optional') {
      return true;
    }
    if(permission == 'user') {
      app.db.users.findOne({key: req.query.key}, (err,user) => {
        if(!user) {
          return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
        }
        req.user = user;
        return next();
      });

    if(permission == 'admin') {
      app.db.users.findOne({key: req.query.key, role: 'admin'},(err,user) =>{
        if(!user) {
          return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
        }
        req.user = user;
        return next();
      });
     }
   }
 }
}
app.get('/api/users', _auth('user'),(req, res) => {
 if(!req.query.key){
   console.log(req.query.key);
    return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.PERMISSION_DENIED))
  }
  app.db.users.find().skip(req.query.offset)
      .limit(req.query.limit)
      .exec((err,data) => {
        if(err){
          return res.send('not found');
        }
          let response = data.map(d => {
          return {
            username: d.username,
            id: d._id,
            name: d.name,
            password: d.password,
            //key: d.key,
            age: d.age,
            email: d.email
          }
        });
        return res.send(response);
      });
});
app.post('/api/users',_auth('optional'), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let age = req.body.age;
  let email = req.body.email;
  let uv_response = UserValidator.validateUsername(username);
  if(uv_response != Utility.ErrorTypes.SUCCESS) {
    return res.send(Utility.generateErrorMessage(uv_response));
  }
  if (password.length <AppConstants.PASSWORD_MIN_LENGTH
    || password.length > AppConstants.PASSWORD_MAX_LENGTH) {
      return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.INVALID_PASSWORD_RANGE));
    }
    password = crypto.createHash('sha1').update(password + 'bootcamp').digest('hex');
    app.db.users.findOne({username:username}, (err, data) =>{
      if(data) {
        return res.send('user already exists.');
      }
      if (name){
          if(name.length < AppConstants.NAME_MIN_LENGTH
              || name.length > AppConstants.NAME_MAX_LENGTH){
              return res.send('name range error');
            }
        }
        if (age){
          if(age < AppConstants.AGE_MIN_LENGTH
              || age > AppConstants.AGE_MAX_LENGTH){
                return res.send('age range error');
              }
        }
      if(email){
            if(EmailValidator.isEmail(email) == false){
            return res.send('invalid email');
          }
        }
      app.db.users.create({
        username: username,
        password: password,
        name: name,
        age: age,
        email: email
      }, (err, data) => {
        if (err) {
          return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_CREATION_ERROR));
        }
      return res.send(data);
      })
    });
});
app.put('/api/users/:id',_auth('user'), (req,res)=>{
  if(req.user.role != 'admin') {
  if(res.send.id != req.user._id) {
    return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.PERMISSION_DENIED));
  }
  }
let id = req.params.id;
let user = {
  username : req.body.username,
  password : req.body.password,
  name : req.body.name,
  age : req.body.age,
  email : req.body.email
}
if(!id){
  return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR))
}
  app.db.users.findByIdAndUpdate(id,{$set: req.body},(err,data)=>{
    if(err){
      return res.send('error');
    }
    console.log(data)
    return res.send(data);
  });
});
app.delete('/api/users/:id', _auth('admin'),(req,res) => {
  app.db.users.findOne({key: req.query.key, role:'admin'},(err, user)=> {
    if(err || !user){
    return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR))
  }
  })
        let id = req.params.id;
        if(!id) {
            return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR));
        }
        app.db.users.findOneAndRemove({_id:id}, (err,data)=> {
           if(err) {
              return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_DELETE_ERROR));
           }
           return res.send(data);
        })
    });

}

/*
************function _auth(permission) {
  return function (req, res, next){
  if(permission == 'optional') {
    return true;
  }
  if(permission == 'user') {
    app.db.users.findOne({key: req.query.key}, (err,user) => {
      if(!user) {
        return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
      }
      req.user = user;
      return next();
    });

  if(permission == 'admin') {
    app.db.users.findOne({key: req.query.key, role: 'admin'},(err,user) =>{
      if(!user) {
        return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
      }
      req.user = user;
      return next();
    });
  }
}
}
*************************
*************
_auth('user'),
_auth('optional'),
,_auth('admin')
*******************************
if(!req.query.key){
return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.PERMISSION_DENIED))
}
***************************
console.log('req.query ==', req.query);
if(req.user.role != 'admin') {
if(res.send.id != req.user._id) {
  return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.PERMISSION_DENIED));
}
}
  return true;
***************************************
  app.db.users.findOne({key: req.query.key, role:'admin'},(err, user)=> {
    if(err || !user){
    return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR))
  }
  })
*/
