const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const io = require('../index');
const routes = require('../models/routes');
const points = require('../models/points');

var lastRoutId = "";

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

router.get('/geolocation', async (req, res) => {
    var allRoutes = await routes.find({user: req.user.id}).sort({date:'desc'});
    res.render('geolocation', {allRoutes});
});

router.post('/geolocation', function(req, res){
    req.flash('success_msm', 'Route saved');
    res.render('geolocation');
});

router.get('/routeDetails', async function(req, res){
    const allPoints = await points.find({idRoute: req.params.id}).sort({date:'desc'});
    res.render('routeDetails', {pointsArray: JSON.stringify(allPoints), allPoints});
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

io.on('connection', function(socket){
    socket.on('new route', async function(route){
        const newRoute = new routes({
            user: route.user,
            name: route.name
        });
        lastRoutId = newRoute.id;
        await newRoute.save();
    });
});

io.on('connection', function(socket){
    socket.on('new point', async function(point){
        const newPoint = new points({
            idRoute: lastRoutId,
            latitude: point.latitude,
            longitude: point.longitude,
            user: point.user
        });
        await newPoint.save();
    });
});

module.exports = router;
