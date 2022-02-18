document.write('<link href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" rel="stylesheet">');
document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>');
function logout(){
    swal({
      title:"退出",
      text:"真的要退出吗？小猫猫很好看的哟",
      showConfirmButton:true,
      confirmButtonText:"残忍退出",
      showCancelButton:true,
      cancelButtonText:"再看一会",
    },function(){
      window.location.href="/logout";
    })
}
function display(id){

  document.cookie="id="+id;
  // router.post('/display',function(req,res,next){

  //   req.body.id=id;

    window.location.href = "/display";

  //   var psd = req.body.password;
    
  //   // User.findOne({username:usrname},function(err,result){
  //   //   if(err){
  //   //     console.log(err);
  //   //     res.send({succeed:false,message:'Server Error'});
  //   //     return err;
  //   //   }else{
  //   //     if(result==null){
  //   //       res.send({succeed:false,message:'This discount does not exit!'});
  //   //     }else{
  //   //       if(bcrypt.compareSync(psd,result.password)){// 哈希验证密码
  //   //         req.session.username = usrname;
  //   //         res.send({succeed:true,message:''});
  //   //       }else{
  //   //         res.send({succeed:false,message:'Wrong password!'})
  //   //       }
  //   //     }
  //   //   }
  //   // })
  // })

}