const passport = require('passport');
const local_passport = require('passport-local');

const User = require('../models/User');

passport.use(new local_passport({
    usernameField: 'email'
}, async (email, password, done) =>{
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'Not user found'});
    }
    else{
        const match = await user.decrypt(password);
        if (match){
            return done(null, user);
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
