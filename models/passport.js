var passport = require('passport');
var User = require('./usermodel.js');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
        done(null,user.id);
    });

passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });

passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // User.findOne wont fire unless data is sent back
        
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);

                // check if user already exists
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } 
                else {
                // create the user
                var newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.role = 'user';

                // entry into the db/users
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    console.log('user registered successfully');
                    return done(null, newUser);
                });
                }

            });    

        });

    }));


passport.use('local-login',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done){
        console.log("entered into local login" + email);
        
         User.findOne({ 'email' :  email, 'role' : "user" }, function(err, user) {
            if (err)
                return done(err);

            // if no user is found
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            // if the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // return successful user
            return done(null, user);
            console.log('user profile to be shown');
        });
    }));

passport.use('admin-login',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req,email,password,done){
        console.log("entered into local login" + email);
        
         User.findOne({ 'email' :  email, 'role' : "admin" }, function(err, user) {
            if (err)
                return done(err);

            // if no user is found
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // return successful user
            return done(null, user);
            console.log('user profile to be shown');
        });
    }));


module.exports = passport;
