var express = require('express');
var User = require('../models/usermodel');
var Category = require('../models/categorymodel');
var subCategory = require('../models/subcategorymodel');
var passport = require('../models/passport');
var path = require('path');
var router = express.Router();
var url = require('url');

router.get('/adminLogin', function(req, res, next){
	res.render('adminLogin', {message : req.flash('loginMessage') });
});

router.post('/adminLogin', passport.authenticate('admin-login', {
	successRedirect : '/admin/adminProfile',
    failureRedirect : '/admin/adminlogin',
    failureFlash : true // allow flash messages
})
);

router.get('/adminProfile', isLoggedIn, function(req, res, next){
	console.log('admin login successful' + req.user);
	res.render('adminProfile', {
		user : req.user
	})
})

router.get('/viewall', function(req, res, next){
	User.find({'role' : "user"}, function(err, users){
		console.log(users);
		res.render('viewall', {'user': req.user, 'users' : users});
	});
});

router.get('/addCategory', function(req, res, next){
	req.flash('successMessage', 'Category added successfully!!!');
	res.render('addCategory', { message:'', user : req.user});
});

router.post('/addCategory', function(req, res, next){
	var myfile = req.files.myfile;
	var fileName = req.body.name + "_" + myfile.name;
	var filePath = path.join(__dirname, '../public/uploads/category', fileName);
	console.log(filePath);
	myfile.mv(filePath, function(err){
		if(err)
			console.log("upload failed");
		else{
			var newCategory = new Category();
			newCategory.name = req.body.name;
			newCategory.fileName = fileName;
			newCategory.created_at = new Date();
			newCategory.save(function(err){
				if(err)
					throw err;
				console.log("file entry and uploading successful");
			});
			res.render('addCategory', { message : req.flash('successMessage'),
										 user: req.user});
		}		
	});
	console.log(myfile);
});

router.get('/addSubCategory', function(req, res, next){
	req.flash('successMessage', 'Sub-Category added successfully!!!');
	Category.find({}, function(err, categories){
		if(err)
			console.log(err);
		console.log(categories);
		res.render('addSubCategory', { message:'', user : req.user, 'categories': categories });
	});
});

router.post('/addSubCategory', function(req, res, next){
	console.log(req.body);
	var myfile = req.files.myfile;
	var fileName = req.body.subCategoryName + "_" + myfile.name;
	var filePath = path.join(__dirname, '../public/uploads/subCategory', fileName);
	console.log(filePath);
	myfile.mv(filePath, function(err){
		if(err)
			console.log(err);
		else{
			var newSubCategory = new subCategory();
			newSubCategory.categoryName = req.body.categoryName;
			newSubCategory.subCategoryName = req.body.subCategoryName;
			newSubCategory.fileName = fileName;
			newSubCategory.created_at = new Date();
			newSubCategory.save(function(err){
				if(err)
					throw err;
				console.log("file entry and uploading successful");
			});

			Category.find({}, function(err, categories){
				if(err)
					console.log(err);
				console.log(categories);
				res.render('addSubCategory', { message : req.flash('successMessage'), 
											user : req.user, 'categories': categories });
			});
		}		
	});
});

router.get('/deleteOne', function(req, res, next) {
	var qs = url.parse(req.url, true).query;
	console.log(qs);
	User.findOneAndDelete({'email':qs.email}, function(err, user){
		console.log(user.name + 'successfully deleted');
		User.find({'role' : "user"}, function(err, users){
		console.log(users);
		res.render('viewall', {'user': req.user, 'users' : users});
	});
	});	
});

router.get('/logout', function(req,res,next){
	name = req.user.name;
	req.session.destroy();
	res.redirect('/');
	next();
},function(){
	console.log(name + ' successfully logged out');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}


module.exports = router;