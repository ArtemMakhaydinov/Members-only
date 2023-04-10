const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const session = require('express-session');
const connection = require('./config/database');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// =============== GENERAL SETUP ===============

require('dotenv').config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =============== SESSION ===============

const clientP = connection.then((m) => m.connection.getClient());

const sessionStore = MongoStore.create({
    clientPromise: clientP,
    collectionName: 'sessions',
});

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, //1 day
        },
    })
);

// =============== PASSPORT ===============

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// =============== ROUTES ===============

app.use(routes);

// =============== ERRORS ===============

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
