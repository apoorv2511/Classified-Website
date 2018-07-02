var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema();

var subCategorySchema = mongoose.Schema({
	categoryName : String,
	subCategoryName : String,
	fileName : String,
	created_at : Date 
});

subCategorySchema.methods.uploadFile = function uploadFile(categoryName, subCategoryName, filename, cb){
	categorySchema.categoryName = categoryName;
	categorySchema.subCategoryName = subCategoryName;
	categorySchema.fileName = filename;
	var result = 'file uploaded successfully';
	categorySchema.save(function(err){
		if(err)
			console.log(err);
		else
			cb(result);
	})
}

var subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;