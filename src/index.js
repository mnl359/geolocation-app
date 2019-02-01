const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const method = require('method-override');
const expSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// Initialization
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(method('_method'));
app.use(expSession({
    secret: 'Yolo',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
passport.use(expSession());
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

// Routes
app.use(require('./routes/index'));

// Statis files
app.use(express.static(path.join(__dirname, 'public')));

// Server init
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});