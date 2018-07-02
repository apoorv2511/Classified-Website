var express = require('express');
var flash = require('connect-flash');
var User = require('../models/usermodel.js');
var Category = require('../models/categorymodel');
var subCategory = require('../models/subcategorymodel');
var passport = require('../models/passport');
var url = require('url');


var router = express.Router();

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());



router.get('/', function(req, res, next) {
	Category.find({}, function(err, categories){
		if(err)
			console.log(err);
		console.log(categories.length);
		res.render('index', { 'title': 'Resale', 'categories': categories });
	})
});

router.get('/postAd', function(req, res, next) {
	res.render('postAd', { 'title': 'Post an Ad' });
});

router.get('/api/category', function(req, res, next) {
	//var name = req.params(category);
	var qs = url.parse(req.url, true).query;
	var name = qs.category;
	console.log(qs);
	subCategory.find({'categoryName' : name}, function(err, subCategories){
		if(err)
			console.log(err);
		console.log(subCategories);
		res.render('subCategories', { 'title': 'Resale', 'subCategories': subCategories });
	})

	//res.send(name);
});

//Login routings
router.get('/login', function(req, res, next) {
	res.render('login', {message : req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
})
);

router.get('/profile', isLoggedIn, function(req, res, next){
	console.log(req.user);
	res.render('profile',{
		user : req.user
	});
})

router.get('/register', function(req, res, next) {
	res.render('register', {message : req.flash('signupMessage') });
});

router.post('/register', passport.authenticate('local-signup',{
	successRedirect : '/profile',
		failureRedirect : '/register',
		falureFlash : true
}), 
function(req, res, next) {
	console.log('user inserted');
});

router.get('/logout', function(req,res,next){
	name = req.user.name;
	req.session.destroy();
	res.redirect('/');
	next();
},function(){
	console.log(name + ' successfully logged out');
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

module.exports = router;