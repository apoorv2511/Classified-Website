var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema();

var userSchema = mongoose.Schema({
	name : String,
	email : String,
	password : String,
	confpassword : String,
	role : String 
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password);
};

userSchema.methods.findUsers = function(){
	userSchema.find({'role' : "user"}, function(err, users){
		if(err)
			console.log(err);
		else
			return users;
	})
}

var User = mongoose.model('User', userSchema);



module.exports = User;