# Web hw3 文档说明

[TOC]

## 1. 实验目标

- 基于ajax，nodejs，数据库等技术实现完整的登录注册系统。
- 进行密码加密存储与解密，进行密码合法性判断。
- 将前两次作业整合，完成到全新的nodejs express框架中。

## 2. 实验环境

- nodejs，express
- mongoDB
- VSCode
- chrome

## 3. 实验过程详述

### 3.1 搭建nodejs express项目

- 通过应用生成器工具 `express-generator` 快速创建一个express的骨架。
- npx包含在 Node.js 8.2.0 及更高版本中。

```html
$ npx express-generator
$ express hw3
```

- 然后安装依赖包，启动应用。

```
$ cd myapp
$ npm install
```

- 在windows的powershell中执行：

```
PS> $env:DEBUG='myapp:*'; npm start
```

- 然后在浏览器中打开http://localhost:3000/。
- 具有这样的目录结构：

![image-20211212185226798](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212185226798.png)

在此目录结构基础上，添加：

- utils文件夹，存放公共的api接口与数据库连接程序。

- views下details文件夹，存放水印详情图的html文件。

### 3.2 mongoDB数据库

#### 3.2.1 建立本地数据库

- 由于使用mongoDB图形化界面直接创建数据库，故这里没有提交sql类文件。
- 建立数据库如图：包含users一个表。

![image-20211212190045365](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212190045365.png)

列项：

- username
- password
- email
- sex

#### 3.2.2 数据库控制与管理

在程序中采用mongoose包来控制数据库进行交互：

```javascript
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user',{
  useNewUrlParser: true,
  useUnifiedTopology:true
})
.then(()=>console.log('Connected'))
.catch(err=>console.log(err,'Disconnected'));

var userSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:String,
  sex:String
});
var User = mongoose.model('user',userSchema);
module.exports=User;
```

- 这里建立自己的数据模板User，用于存储数据，主要用两个方法：User.findOne与User.create。前者用于根据某个字段的值去数据库中查找对应的表项元组并返回（select where）。后者用于往数据库中插入新元组。

### 3.3 实现验证码

- 这里采用两位数任意加减法的验证方式，且实现点击验证码图片/看不清？字样后更新验证码。
- 验证码通过前端特殊css样式展示给用户。
- 每次进入需要验证码的界面时自动更新验证码。

- 通过ajax请求实现。

#### 3.3.1 通过ajax请求实现验证码创建

- 这里先建立ajax请求以及回调函数处理显示验证码，使用get类型的请求：

```javascript
$.ajax({
      url: '/mongo/getCheckCode',
      type: 'get',
      success:function(res){
        if(res.succeed){
          document.getElementById("checkCode").innerHTML=res.message;
        }
      }
})
```

- 然后实现具体路径方法：

```javascript
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
```

- 这里用javascript实现了随机产生一个两位数加减式子的函数。结果用code字符串来存，并将结果包装在message中返回给ajax回调函数来显示。

#### 3.3.2 通过ajax请求实现验证码正确性验证

- ajax请求，采用await类型，表明是同步请求，必须等待验证完成才能进行下一步：

```javascript
await $.ajax({
        url: '/mongo/checkCheckCode?inputCode=' + inputCode + '&checkCode=' + checkCode,
        type: 'get',
        success:function(res){
            if(!res.succeed){
                document.getElementById("wrongidcode").innerText="wrong";
            }

        }
})
```

- 检验输入与预期结果是否一致，返回验证结果：

```javascript
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
```

### 3.4 实现路由跳转

#### 3.4.1. 路由注册

- 主要位于router文件夹的index.js中，实现访问控制。
- watermark.js用于控制水印相关界面跳转。

- 增加对主页的访问控制，每次检查session中间件是否存有当前用户的username。
- 每次跳转至登录，注册界面，清空session。
- 每次退出登录时清空session。

```javascript
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
router.get('/register', function(req, res) {
  res.render('register');
});
router.get('/forgetpsd', function(req, res) {
  res.render('forgetpsd');
});
router.get('/display', function(req, res) {
  res.render('display');
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

```

- session中间件：保存在服务器端的键值对，用于保存用户登录状态。定义如下：位于app.js中

```javascript
app.use(session({
  secret:'secret',
  name:'username',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:60000}
}))
```

#### 3.4.2 路由逻辑实现

- 实现了登陆后跳转至主页
- 任意页面点击退出后，返回登录界面
- 其他逻辑跳转

### 3.5 实现登录/注册过程中的前端数据校验（不涉及ajax请求）

- 通过错误标志error，一旦出现错误，则置为1。

#### 3.5.1 username

- 要求用户名必须大于等于两个字符，检验username是否输入，是否长度符合要求。

```javascript
if (userName.length < 2) {
    if(!userName.length>0){
      document.getElementById("nousername").hidden=false;
      error = 1;
    }
    else{
      document.getElementById("nousername").innerText = "用户名过短！";
      document.getElementById("nousername").hidden=false;
      error = 1;
    }
}
```

#### 3.5.2 password

- 要求密码必须大于等于6个字符，且字母数字混合，检查是否长度与密码强度符合要求。
- 要求注册时两次密码输入一致。

```javascript
  if (psd.length < 6) {
    if(!psd.length>0){
      document.getElementById("nopassword").hidden=false;
      error=1;
    }
    else{
      document.getElementById("nopassword").innerText = "密码长度不足6位！";
      document.getElementById("nopassword").hidden=false;
      error = 1;
    }
  }
  if (psd != psd1) {
    document.getElementById("different").innerText = "两次密码输入不一致！";
    document.getElementById("different").hidden=false;
    error = 1;
  }
  if (isEasyPassword(psd)) {
    if(!psd.length>0) error=1;
    else{
      document.getElementById("nopassword").innerText = "你的密码应该同时包含字母和数字！";
      document.getElementById("nopassword").hidden=false;
      error = 1;
    }
  }
```

#### 3.5.3 sex

- 要求必须选择性别

```javascript
if(sex===null){
    document.getElementById("nosex").hidden=false;
    error=1;
}
```

#### 3.5.4 identify code

- 验证码不能为空
- 验证码必须输入正确

```javascript
 if (inputCode.length <= 0) {
    document.getElementById("noidcode").innerText = "请输入验证码！"
    document.getElementById("noidcode").hidden=false;
    error = 1;
    createCode();
  } else {
    await checkInputCode(inputCode, checkCode);
    if (document.getElementById("wrongidcode").innerText == "wrong") {
      document.getElementById("wrongidcode").innerText = "验证码错误！";
      document.getElementById("wrongidcode").hidden=false;
      error = 1;
      createCode();
    }
  }
```

#### 3.5.5 email

- 邮箱必须输入
- 邮箱要符合要求（正则实现）

```javascript
if (isEmail(email) == false) {
    if(email.length<=0){
      document.getElementById("noemail").hidden=false;
      error = 1;
    }
    else{
      document.getElementById("noemail").innerText = "无效邮箱！";
      document.getElementById("noemail").hidden=false;
      error = 1;
    }
}
```

#### 3.5.6 正则表达式判断合法性与密码强度

- 合法邮箱
- 简单密码，密码的强度
- 正则表达式这一强大工具，可以直接匹配用户输入的字符串来判断是否符合要求，避免无效数据对使用造成影响。

```javascript
function isEmail(email) {
  var reg = /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+\.){1,63}[A-Za-z0-9]+$/;
  return reg.test(email);
}
function isEasyPassword(psd){
    var error=0;
    if (/\d/.test(psd)) {
      error++;
    }
    if (/[a-zA-Z]/.test(psd)){
      error++;
    }
    return error<2;
}
```



### 3.6 实现用户密码加密处理

- 通过阅读材料，决定采用安全系数较高的加盐哈希方法。
- 在数据库存储过程中，采用加密方式，而不存储密码明文，保证用户数据安全。
- 加盐并哈希用户密码，采用10级加盐，且保证每个用户的盐值不同。
- 使用bcrypt包实现

```javascript
var salt = bcrypt.genSaltSync(10); // 设置加盐等级
...
...
var hashCode = bcrypt.hashSync(psd, salt);
```

### 3.7 实现注册功能

#### 3.7.1 通过ajax请求实现注册

- 如果输入合法，调用ajax请求如下：

```javascript
$.ajax({
      url: '/mongo/register',
      type: 'post',
      dataType: 'json',
      data: {'username':userName, 'password':psd, 'email':email, 'sex':sex},
      success: function (res) {
        if (res.succeed) {
          swal({
            title: "注册",
            text: "恭喜你注册成功！现在可以开始尽情欣赏猫片啦！",
            type: "success",
            confirmButtonText: "好耶!",
          }, function () {
            window.location.href = "/login";
          });
        } else {
          if (res.message === 'username') {
            document.getElementById("repeatusername").hidden=false;
          } else {
            document.getElementById("noemail").innerText = "此邮箱已注册！";
            document.getElementById("noemail").hidden=false;
          }
          createCode();
        }
      }
})
```

- 这里的ajax请求使用post类型，将用户输入的注册信息封装在req.body中进行请求。
- 回调函数中，如果请求成功，则跳转至登录界面。

#### 3.7.2 通过ajax回调函数进一步校验数据

- 处理特殊情况：用户名已经存在和邮箱已经被注册，分别是根据res.message判断，返回给前端显示。

#### 3.7.3 请求方法实现（加盐，加哈希）

- 这里使用上述的加盐方法处理password。

```javascript
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
```

### 3.8 实现登录功能

#### 3.8.1 通过ajax请求实现登录

```javascript
if (error === 0) {
      $.ajax({
        url: '/mongo/login',
        type: 'post',
        dataType: 'json',
        data: {'username':usrname, 'password':psd},
        success: function (res) {
          if (res.succeed) {
            window.location.href = "/index";
          } else {
            document.getElementById("wrongup").hidden = false;
            createCode();
          }
        }
      })
    } else {
      createCode();
    }
```

- 如果输入皆合法，则用ajax请求后端数据，登录成功则直接跳转至主页，否则用户名或密码错误。

#### 3.8.2 具体路由方法实现：

```javascript
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
```

- 这里的密码直接调用compareSync来实现，保证明文密码不出现。

### 3.9 实现密码找回

- 需要用户提供用户名和邮箱，用于密码找回。
- 与登录注册类似，进行数据校验后向后端请求数据。

#### 3.9.1 ajax请求定义

```javascript
if (error === 0) {
        $.ajax({
            url: '/mongo/forget',
            type: 'post',
            dataType: 'json',
            data: {'username':username, 'email':email},
            success: function (res) {
                if (res.succeed) {
                    swal({
                        title: "找回密码",
                        text: "您的密码已发送到您的邮箱！请查收！（其实没有实现（狗头",
                        type: "success",
                        confirmButtonText: "好耶！",
                    }, function () {
                        window.location.href = "/login";
                    });
                } else {
                    document.getElementById("nousername").innerText = res.message;
                    document.getElementById("nousername").hidden=false;
                    createCode();
                }
            }
        })
    } else {
        createCode();
    }

```

- 通过弹窗方式来显示密码已经发送到您的邮箱（暂未实现www），并跳转至登录界面

#### 3.9.2 数据判断

- 用email查找数据库，并且比对username是否输入正确。
- 若没有查找到元组，返回用户不存在错误。

```javascript
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
```

### 3.10 完善前端页面设计

- 增加了忘记密码页面
- 增加了登录注册界面的跳转按钮
- 增加了主页的丰富性

## 4. 界面截图

##### 登录界面

![image-20211212231638283](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212231638283.png)

##### 错误提示

![image-20211212231724517](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212231724517.png)

##### 不输入密码

![image-20211212231809580](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212231809580.png)

##### 验证码输入错误

![image-20211212231845879](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212231845879.png)

##### 用户名/密码错误

![image-20211212231945588](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212231945588.png)

##### 注册

![image-20211212232156607](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232156607.png)

##### 错误提示

![image-20211212232227413](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232227413.png)

##### 密码输入不一致

![image-20211212232301765](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232301765.png)

##### 邮箱不合法

![image-20211212232350437](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232350437.png)

##### 忘选性别

![image-20211212232426192](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232426192.png)

##### 重复用户名

![image-20211212232529056](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232529056.png)

##### 注册成功

![image-20211212233141516](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212233141516.png)

##### 数据表项截图

![image-20211212233214189](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212233214189.png)

##### 找回密码

![image-20211212232934538](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232934538.png)

##### 错误

![image-20211212232955335](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232955335.png)

##### 找回密码成功

![image-20211212233052186](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212233052186.png)

##### 系统主页

![image-20211212232011585](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232011585.png)

##### 水印页面

![image-20211212232041529](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232041529.png)

##### 详细图片

![image-20211212232112236](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212232112236.png)

##### 退出

![image-20211212233249225](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20211212233249225.png)

