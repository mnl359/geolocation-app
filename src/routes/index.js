const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post('/signin', (passport.authenticate('local', {
    successRedirect: '/geolocation',
    failureRedirect: '/signin',
    failureFlash: true
})));

router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', async (req, res) => {
    const {email, name, password} = req.body;  
    const errors = [];
    if (email.length <= 0){
        errors.push({text: 'Email is empty'});
    }
    if (name.length <= 0){
        errors.push({text: 'Name is empty'});
    }
    if (password.length <= 0){
        errors.push({text: 'Password is empty'});
    }
    if (errors.length > 0){
        res.render('signup', {errors, email, name, password});
    }
    else{
        const emailUser = await User.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'The Email is already in use.');
            res.redirect('signin');
        }
        const newUser = new User({email, name, password});
        newUser.password = await newUser.encrypt(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered.');
        res.redirect('signin');
    }
});

router.get('/geolocation', (req, res) => {
    res.render('geolocation');
});

module.exports = router;
