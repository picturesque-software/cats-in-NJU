var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

var User = require('./mongo');
var salt = bcrypt.genSaltSync(10); // 设置加盐等级
router.post('/login',function(req,res,next){

  var usrname = req.body.username;
  var psd = req.body.password;

  User.findOne({username:usrname},function(err,result){
    if(err){
      console.log(err);
      res.send({succeed:false,message:'Server Error'});
      return err;
    }else{
      if(result==null){
        res.send({succeed:false,message:'This discount does not exit!'});
      }else{
        if(bcrypt.compareSync(psd,result.password)){// 哈希验证密码
          req.session.username = usrname;
          res.send({succeed:true,message:''});
        }else{
          res.send({succeed:false,message:'Wrong password!'})
        }
      }
    }
  })
})
router.get('/checkCheckCode',function(req,res,next){
  var checkCode=req.query.checkCode;
  var inputCode=req.query.inputCode;
  var i=0;
  var a="";
  while(checkCode.charAt(i)!='-'&&checkCode.charAt(i)!='+'&&checkCode.charAt(i)!=" "){
    a+=checkCode.charAt(i);
    i++;
  }
  var operator=checkCode.charAt(i);
  i++;
  var b="";
  while(checkCode.charAt(i)!='\0'){
    if(checkCode.charAt(i)=='') {
      break;
    }
    b+=checkCode.charAt(i);
    i++;
  }

  a=a*1;
  b=b*1;

  if (operator=== '-') {

    if (inputCode == (a - b)) {
      res.send({succeed: true, message: ''})
    } else {
      res.send({succeed: false, message: ''})
    }

  }
  else{
    if(inputCode==(a+b)){
      res.send({succeed:true,message:''})
    }
    else{
      res.send({succeed:false,message:''})
    }
  }
})
router.get('/getCheckCode',function(req,res,next){
  var code = "";
  var codeChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var charNum = Math.floor(Math.random() * 10);
  if(charNum!=0) {
    code += codeChars[charNum];
  }
  var charNum = Math.floor(Math.random() * 10);
  code += codeChars[charNum];
  var charNum=Math.floor(Math.random()*2);
  if(charNum==1) {
    code+="+";
  }
  else {
    code+="-";
  }
  var charNum = Math.floor(Math.random() * 10);
  if(charNum!=0) {
    code += codeChars[charNum];
  }
  var charNum = Math.floor(Math.random() * 10);
  code += codeChars[charNum];
  res.send({succeed:true,message:code})
})

router.post('/forget',function(req,res,next){
  var email= req.body.email;
  var username=req.body.username
  User.findOne({email:email},function(err,result){
    if(err){
      console.log(err);
      res.send({succeed:false,message:'Sever Error!'});
      return err;
    }else{
      console.log(result)
      if(result==null){
        res.send({succeed:false,message:'用户不存在！'});
      }
      else if(username!=result.username){
        res.send({succeed:false,message:'用户名错误！'})
      }
      else{
        res.send({succeed:true,message:''});
      }
    }
  })
})
router.post('/register',function(req,res){
  var username = req.body.username;
  var psd = req.body.password;
  var email = req.body.email;
  var sex = req.body.sex;
  User.findOne({username:username},function (err,result) {
    if(err){
      console.log(err);
      res.send({succeed:false,message:'Server Error'});
    }else{
      if(result!=null){
        res.send({succeed:false,message:'username'});
      }else{
        User.findOne({email:email},function(err,result){
          if(result!=null){
            res.send({succeed:false,message:'email'});
          }
         else {
           //TODO加盐存密码
            var hashCode = bcrypt.hashSync(psd, salt);
            User.create({
              username: username,
              password: hashCode,
              email: email,
              sex: sex
            }, function (err1, doc) {
              if (err1) {
                console.log(err1);
                res.send({succeed: false, message: ''});
              } else {
                res.send({succeed: true, message: ''});
              }
            })
          }
        })

      }
    }    
  })
})
module.exports = router;