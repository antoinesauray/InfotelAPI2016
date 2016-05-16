var express = require('express');
var multer  = require('multer')
var jwt    = require('jsonwebtoken');
var config    = require(__dirname + '/../config/config.json')["token"];
var fs        = require('fs');
var router  = express.Router();
module.exports = router;

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({
  storage : storage,
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
 }).single('file');

router.post('/',function(req,res){
  upload(req,res,function(err) {
      if(err) {
          return res.status(200).send({
             message: 'File upload FAILED',
             error: err
          });
      }
      res.status(201).send({
         message: 'File uploaded SUCCEEDED',
         file: req.file.path
      });
  });
});
