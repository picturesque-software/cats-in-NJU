document.write('<link href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet">');
document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>');
window.onload=function(){
  createCode();
}
function cancel(){
  window.location.href="/login";
}
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
function GetRadioValue(RadioName){
  var obj;   
  obj=document.getElementsByName(RadioName);
  if(obj!=null){
      var i;
      for(i=0;i<obj.length;i++){
          if(obj[i].checked){
              return obj[i].value;           
          }
      }
  }
  return null;
}
async function register() {
  var userName = $("#username").val();
  var email = $("#email").val();
  var psd = $("#password").val();
  var psd1 = $("#password1").val();
  var sex= GetRadioValue('sex');
  var checkCode = document.getElementById("checkCode").innerHTML;
  var inputCode = document.getElementById("inputCode").value;
  var error = 0;
  document.getElementById("nousername").hidden=true;
  document.getElementById("repeatusername").hidden=true;
  document.getElementById("nopassword").hidden=true;
  document.getElementById("nopassword1").hidden=true;
  document.getElementById("different").hidden=true;
  document.getElementById("noemail").hidden=true;
  document.getElementById("nosex").hidden=true;
  document.getElementById("noidcode").hidden=true;
  document.getElementById("wrongidcode").hidden=true;
  if (userName.length < 2) {
    if(!userName.length>0){
      document.getElementById("nousername").hidden=false;
      error = 1;
    }
    else{
      document.getElementById("nousername").innerText = "??????????????????";
      document.getElementById("nousername").hidden=false;
      error = 1;
    }
  }
  if (isEmail(email) == false) {
    if(email.length<=0){
      document.getElementById("noemail").hidden=false;
      error = 1;
    }
    else{
      document.getElementById("noemail").innerText = "???????????????";
      document.getElementById("noemail").hidden=false;
      error = 1;
    }
  }
  if (psd != psd1) {
    document.getElementById("different").innerText = "??????????????????????????????";
    document.getElementById("different").hidden=false;
    error = 1;
  }
  if (psd.length < 6) {
    if(!psd.length>0){
      document.getElementById("nopassword").hidden=false;
      error=1;
    }
    else{
      document.getElementById("nopassword").innerText = "??????????????????6??????";
      document.getElementById("nopassword").hidden=false;
      error = 1;
    }
  }
  if (isEasyPassword(psd)) {
    if(!psd.length>0) error=1;
    else{
      document.getElementById("nopassword").innerText = "????????????????????????????????????????????????";
      document.getElementById("nopassword").hidden=false;
      error = 1;
    }
  }
  if (inputCode.length <= 0) {
    document.getElementById("noidcode").innerText = "?????????????????????"
    document.getElementById("noidcode").hidden=false;
    error = 1;
    createCode();
  } else {
    await checkInputCode(inputCode, checkCode);
    if (document.getElementById("wrongidcode").innerText == "wrong") {
      document.getElementById("wrongidcode").innerText = "??????????????????";
      document.getElementById("wrongidcode").hidden=false;
      error = 1;
      createCode();
    }
  }
  if(sex===null){
    document.getElementById("nosex").hidden=false;
    error=1;
  }
  

  if (error === 0) {
    $.ajax({
      url: '/mongo/register',
      type: 'post',
      dataType: 'json',
      data: {'username':userName, 'password':psd, 'email':email, 'sex':sex},
      success: function (res) {
        if (res.succeed) {
          swal({
            title: "??????",
            text: "??????????????????????????????????????????????????????????????????",
            type: "success",
            confirmButtonText: "??????!",
          }, function () {
            window.location.href = "/login";
          });
        } else {
          if (res.message === 'username') {
            document.getElementById("repeatusername").hidden=false;
          } else {
            document.getElementById("noemail").innerText = "?????????????????????";
            document.getElementById("noemail").hidden=false;
          }
          createCode();
        }
      }
    })
  } else {
    createCode();
  }
}
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