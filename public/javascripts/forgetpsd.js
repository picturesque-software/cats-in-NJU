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
//find back password
async function getPassword() {

    var username = $("#username").val();
    var email = $("#email").val();

    var checkCode = document.getElementById("checkCode").innerHTML;
    var inputCode = document.getElementById("inputCode").value;
    var error = 0;
    document.getElementById("nousername").hidden=true;
    document.getElementById("errorusername").hidden=true;
    document.getElementById("noemail").hidden=true;
    document.getElementById("noidcode").hidden=true;
    document.getElementById("wrongidcode").hidden=true;
    if(username === ''){
        document.getElementById("nousername").hidden=false;
    }
    if (email === '') {
        document.getElementById("noemail").hidden=false;
        error = 1;
    }
    if (inputCode.length <= 0) {
        document.getElementById("noidcode").hidden=false;
        error = 1;
        createCode();
    } else {
        await checkInputCode(inputCode, checkCode);
        if (document.getElementById("wrongidcode").innerText == "wrong") {
            document.getElementById("wrongidcode").innerText = "验证码错误";
            document.getElementById("wrongidcode").hidden=false;
            error = 1;
            createCode();
        }
    }
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


}

// 检验邮箱是否合法
function isEmail(email) {
    var reg = /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+\.){1,63}[A-Za-z0-9]+$/;
    return reg.test(email);
}
