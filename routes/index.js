var express = require('express');
var router = express.Router();
var api=require('../utils/api');
/* GET home page. */
router.get('/', function(req, res) {
  req.session.username="";
  res.redirect('/login');
});
router.get('/login', function(req, res) {
  req.session.username="";
  res.render('login');
});
router.get('/logout', function(req, res) {
  req.session.username="";
  res.render('login');
});
router.get('/register', function(req, res) {
  res.render('register');
});
router.get('/forgetpsd', function(req, res) {
  res.render('forgetpsd');
});
router.get('/display', function(req, res) {
  res.render('display');
});
router.get('/caman', function(req, res) {
  res.render('caman');
});
router.get('/cropper', function(req, res) {
  res.render('cropper');
});
router.get('/transfer', function(req, res) {
  res.render('transfer');
});
router.get('/index',function(req,res){
  if(req.session.username){
    console.log(req.session.username);
    res.render('index');
  }
  else{
    res.send("<script>alert('请先登录或注册！');window.location.href='/login'</script>");
  }
})

router.use('/mongo',api);
module.exports = router;
