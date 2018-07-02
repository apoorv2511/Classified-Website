var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema();

var categorySchema = mongoose.Schema({
	name : String,
	fileName : String,
	created_at : Date 
});

categorySchema.methods.uploadFile = function uploadFile(name, filename, cb){
	categorySchema.name = name;
	categorySchema.fileName = filename;
	var result = 'file uploaded successfully';
	categorySchema.save(function(err){
		if(err)
			console.log(err);
		else
			cb(result);
	})
}

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;