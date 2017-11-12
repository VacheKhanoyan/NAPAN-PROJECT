const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const sizeof = require('image-size');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user-validator');
const ET = Utility.ErrorTypes;
// const storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, 'images/');
//   },
//   filename: (req, file, callback) => {
// 		console.log("file" , file);
// 		callback(null, file.originalname)
// }
// });
const upload = multer({dest: 'images/'});

module.exports = function(app) {
  function _auth(permission) {
    return function (req, res, next){
      if(permission == 'optional') {
        return next();
      }
      if(permission == 'user') {
        app.db.users.findOne({key: req.query.key}, (err,user) => {
          if(!user) {
            return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
          }
          req.user = user;
          return next();
        });
      }
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
  app.get('/api/users', _auth('user'),(req, res) => {
    if(!req.query.key){
      return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED))
    }
    app.db.users.find({}).skip(req.query.offset)
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
          key: d.key,
          age: d.age,
          email: d.email
        }
      });
      return res.send(response);
    });
  });
  app.get('/api/posts',_auth('optional'),(req, res)=>{
    app.db.posts.find({})
    .populate('users')
    .skip(req.query.offset)
    .limit(req.query.limit)
    .sort({createAt: -1})
    .exec((err,data)=>{
      if(err){
        console.log(err);
        return res.send ('not found');
      }
      console.log(data);
      let response = data.map(d =>{
        return {
          id: d._id,
          user: d.user,
          body: d.body,
          creatAt: d.creatAt,
          post_Type: d.post_Type,
          comments: d.comments,
          shares: d.shares,
          tags: d.tags,
          likes: d.likes
        }
      });
      return res.send(response);
    });
  });
  app.get('/api/images',_auth('optional'),(req, res)=>{
    app.db.images.find({})
    .populate('author')
    .skip(req.query.offset)
    .limit(req.query.limit)
    .sort({createAt: -1})
    .exec((err,data)=>{
      if(err){
        console.log(err);
        return res.send ('not found');
      }
      console.log(data);
      return res.send(data);
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
            if(email) {
              let email_res = UserValidator.validateEmail(email);
              if (email_res != Utility.ErrorTypes.SUCCESS) {
                return res.send(Utility.generateErrorMessage(email_res));
              }
            }
          })
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
          });

  });
  app.post('/api/posts',_auth('user'), (req, res) => {
          if(!req.query.key){
            return res.send(Utility.generateErrorMessage(Utility.ErrorTypes.PERMISSION_DENIED))
          }
          let user = req.query.user;
          let body = req.body.body;
          let createAt = req.body.createAt;
          let post_Type = req.body.post_Type;
          let comments = req.body.comments;
          let shares = req.body.shares;
          let tags = req.body.tags;
          let likes = req.body.likes;

          if(body) {
            if(body.length < AppConstants.BODY_MIN_LENGTH
              || body.length > AppConstants.BODY_MAX_LENGTH){
                return res.send('user already exists.');
              }
            }
            app.db.posts.create({
              user: user,
              body: body,
              createAt: createAt,
              post_Type: post_Type,
              comments: comments,
              shares: shares,
              tags: tags,
              likes: likes,
              }, (err, data) => {
              if (err) {
                return res.send(Utility.generateErrorMessage(ET.POST_CREATION_ERROR));
              }
              return res.send(data);
            });
          // }
        });
  app.post('/api/images/', /*_auth('user'),*/upload.single('image'), (req, res) => {
             if(!req.query.key){
               return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED))
             }
             upload.single('avatar')(req,res,function(err) {
                     if(err) {
                         return res.send("Error uploading file.");
                     }
                     res.send("File is uploaded");
                });
            if(!req.file) {
               return res.send(Utility.generateErrorMessage(ET.EMPTY_PHOTO));
            }
            if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
               return res.send(Utility.generateErrorMessage(ET.PHOTO_TYPE_ERROR))
            }
            let dimensions = sizeof('{dest}/{filename}'.replace('{dest}',req.file.destination)
                        .replace('{filename}',req.file.filename));
            let image = {
              content_type: req.file.mimetype,
              size: req.file.size,
              title: req.file.filename,
              buffer: req.file.buffer,
              width: dimensions.width,
              height: dimensions.height,
            }
            app.db.images.create(image, (err, data) => {
                if (err) {
                  return res.send(Utility.generateErrorMessage(ET.POST_CREATION_ERROR));
                }
                return res.send(data);
            })
  });
  app.put('/api/users/:id', _auth('user'), (req,res)=>{
    if(req.user.role != 'admin') {
                if(res.send.id != req.user._id) {
                  return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
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
                return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR))
              }
    app.db.users.findByIdAndUpdate(id,{$set: req.body},(err,data)=>{
      if(err){
        return res.send('error');
      }
      //console.log(data)
      return res.send(data);
    });
  });
  app.put('/api/posts/:id', _auth('user'),(req,res)=>{
              if(!req.params.id){
                return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
              }
              if(req.query.key && app.db.posts.findOne({_id:req.params.id}).user != req.query.key) {
                if(app.db.users.findOne({key:req.query.key}).role != 'admin') {
                  return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
                }
              }
              let id = req.params.id;
              let post = {
                user:req.query.user,
                body: req.body.body,
                creatAt: req.body.creatAt,
                post_Type: req.body.post_Type,
                comments: req.body.comments,
                shares: req.body.shares,
                tags: req.body.tags,
                likes: req.body.likes,
              }
              if(!id){
                return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR))
              }
              app.db.posts.findByIdAndUpdate(id,{$set: req.body}, (err,data)=>{
                if(err) {
                  return res.send('error');
                }
                return res.send(data);
              });
            });
  app.delete('/api/users/:id', _auth('admin'),(req,res) => {
              if(!req.query.key){
                return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED))
              }
              app.db.users.findOne({key: req.query.key, role:'admin'},(err, user)=> {
                if(err || !user){
                  return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
                }
              })
              let id = req.params.id;
              if(!id) {
                return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR));
              }
              app.db.users.findOneAndRemove({_id: id}, (err,data)=> {
                if(err) {
                  return res.send(Utility.generateErrorMessage(ET.USER_DELETE_ERROR));
                }
                return res.send(data);
              })
            });
  app.delete('/api/posts/:id', _auth('admin'),(req,res) => {
    app.db.users.findOne({key:req.query.key, role:'admin'},(err,user) => {
                if(err || !user) {
                  return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
                }
              });
    let id = req.params.id;
    if(!id) {
                return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR));
              }
    app.db.posts.findeOneAndRemove({_id: id}, (err, data) => {
                if(err) {
                  return res.send(Utility.generateErrorMessage(ET.POST_DELETE_ERROR));
                }
                return res.send(data);
              });
  });

  app.delete('/api/images/:id', _auth('admin'), (req, res) => {
          app.db.images.findOne({key: req.query.id, role: 'admin'}, (err, user) => {
            if (err || !user) {
              return res.send(Utility.generateErrorMessage(ET.PHOTO_DELETE_ERROR));
            }
            let id = req.params.id;
            if(!id) {
              return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR));
                    }
              app.db.images.findOneAndRemove({_id: id}, (err, data) => {
                if(err) {
                  return res.send(Utility.generateErrorMessage(ET.PHOTO_DELETE_ERROR));
                }
                res.send (data);
              });
          });
       });
}
