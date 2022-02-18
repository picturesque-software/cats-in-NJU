window.onload=function() {
    createCode();
  };
function createCode() {
    $.ajax({
      url: '/mongo/getCheckCode',
      type: 'get',
      success:function(res){
        if(res.succeed){
          document.getElementById("checkCode").innerHTML=res.message;
        }
      }
    })
  }
async function checkInputCode(inputCode,checkCode) {
    await $.ajax({
      url: '/mongo/checkCheckCode?inputCode=' + inputCode + '&checkCode=' + checkCode,
      type: 'get',
      success:function(res){
        if(!res.succeed){
          document.getElementById("wrongidcode").innerText="wrong";
        }
  
      }
    })
}
async function login() {
    document.getElementById("nousername").hidden=true;
    document.getElementById("nopassword").hidden=true;
    document.getElementById("noidcode").hidden=true;
    document.getElementById("wrongidcode").hidden=true;
    document.getElementById("wrongup").hidden=true;
    var usrname = document.getElementById('username').value;
    var psd = document.getElementById('password').value;
    var checkCode = document.getElementById("checkCode").innerHTML;
    var inputCode = document.getElementById("inputCode").value;
    var error = 0;
    if (usrname === '') {
      document.getElementById("nousername").hidden=false;
      error = 1;
    }
    if (psd === '') {
      document.getElementById("nopassword").hidden = false;
      error = 1;
    }
    if (inputCode.length <= 0) {
      document.getElementById("noidcode").hidden = false;
      error = 1;
      createCode();
    } else {
      await checkInputCode(inputCode, checkCode);
      if (document.getElementById("wrongidcode").innerText == "wrong") {
        document.getElementById("wrongidcode").innerText = "验证码错误！"
        document.getElementById("wrongidcode").hidden=false;
        error = 1;
        createCode();
      }
    }
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
}
  