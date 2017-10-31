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
            password: d.password,
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
app.put('/api/users/:id',(req,res) => {

        app.db.users.find({_id: req.params.id },(err,data) => {
           if(err) {
              return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR));
           }
           let user = {
             username : req.body.username,
             password : req.body.password,
             name : req.body.name,
             age : req.body.age,
             email : req.body.email
           }
           user.username ? user.username = user.username : user.username = data.username;
           user.password ? user.password = user.password : user.password = data.password;
           user.name ? user.name = user.name : user.name = data.name;
           user.age ? user.age = user.age : user.age = data.age;
           user.email ? user.email = user.email : user.email = data.email;
           let uv_response = UserValidator.validateUsername(user.username);

           if (uv_response != Utility.ErrorTypes.SUCCESS) {
                return res.send(Utility.generateErrorMessage(uv_response));
            }
            let pass_response = UserValidator.validateUsername(user.password);
            if (pass_response != Utility.ErrorTypes.SUCCESS) {
                 return res.send(Utility.generateErrorMessage(pass_response));
             }
           user.password = crypto.createHash('sha1').update(user.password + 'bootcamp').digest('hex');
           app.db.users.update({_id:req.params.id},{$set:{username: user.username,
                                                          name : user.name,
                                                          age : user.age,
                                                          email : user.email,
                                                          password : user.password }},(err,value) => {
              if(err) {
                return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_UPDATE_ERROR));
              }
              return res.send(value);
           });
        });
     });
/*app.put('/api/users/:id', (req,res)=>{
let id = req.params.id;
if(!id){
  return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR))
}
    app.db.users.update({},{$set: {_id: id}},(err,data)=>{
    if(err){
      return res.send('error');
    }
    console.log(data)
    return res.send(data);
  });
});*/
app.delete('/api/users/:id',(req,res) => {
        let id = req.params.id;
        if(!id) {
            return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_ID_ERROR));
        }
        app.db.users.findOneAndRemove({_id:id} , (err,data)=> {
           if(err) {
              return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.USER_DELETE_ERROR));
           }
           return res.send(data);
        })
    });
  }
