const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const method = require('method-override');
const expSession = require('express-session');

// Initiliazations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
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

// Global variables

// Routes
app.use(require('./routes/index'));

// Statis files
app.use(express.static(path.join(__dirname, 'public')));

// Server init
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});