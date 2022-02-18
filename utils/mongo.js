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