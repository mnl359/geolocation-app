const passport = require('passport');
const local_passport = require('passport-local');

const User = require('../models/User');

passport.use(new local_passport({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) =>{
    const mail = await User.findOne({email: email});
    if(!mail){
        return done(null, false, {message: 'Not user found'});
    }
    else{
        const match = await mail.decrypt(password);
        if (match){
            return done(null, mail);
        }
        else{
            return done(null, false, {message: 'Incorrect password' })
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
