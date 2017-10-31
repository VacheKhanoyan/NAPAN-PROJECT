const crypto = require('crypto');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user-validator');
const EmailValidator = require('./../services/validators/email-validator')
module.exports = function(app) {
app.get('/api/users',(req, res) => {
  console.log('req.query ==', req.query);
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
            key: d.key,
            name: d.name,
            age: d.age,
            email: d.email
          }
        });
        return res.send(response);
      });
});
app.post('/api/users', (req, res) => {
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
    password = crypto.createHash('sha1').update(password + 'key generator').digest('hex');
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
          console.log('email.validator = ' + EmailValidator.isEmail)
          if(EmailValidator.isEmail == false){
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
app.put('/api/users/:username', (req,res)=>{
  let user = {
    username: req.params.username,
    //password: req.params.password
  };
  console.log(user)
  app.db.users.update(user,{$set: {username:req.body.username}},(err,data)=>{
    if(err){
      return res.send('error');
    }
    console.log(data)
    return res.send(data);
  });
});

app.delete('/api/users/:username', (req, res) => {
   let user = {
     username: req.params.username
   }
   app.db.users.remove(user, {username:req.body.username},(err, data) => {
     if(err) {
       res.send('Error Delete.');
     }
     return res.send(data);
   });
 });
}
