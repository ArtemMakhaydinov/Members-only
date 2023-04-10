const express = require('express');
const router = express.Router();
const validation = require('../lib/validation');
const passport = require('passport');
const isAuth = require('../lib/user-status').isAuthMiddleware;
const isAdmin = require('../lib/user-status').isAuthMiddleware;
const indexController = require('../controllers/index-controller');
const signUpController = require('../controllers/sign-up-controller');
const logInController = require('../controllers/log-in-controller');
const logOutController = require('../controllers/log-out-controller');
const joinController = require('../controllers/join-controller');

// ======================== HOME ========================

router.get('/', indexController.get);
router.post('/', isAuth, validation.validatePost, indexController.post);
router.post('/delete-post', isAdmin, validation.validateDelete, indexController.delete);

// ======================== SIGN UP ========================
router.get('/sign-up', signUpController.get);
router.post('/sign-up', validation.validateSignUp, signUpController.post);

// ======================== LOG IN ========================

const logInAuthOptions = {
    failureRedirect: '/log-in',
    successRedirect: '/',
    failureMessage: true,
};

router.get('/log-in', logInController.get);
router.post(
    '/log-in',
    validation.validateLogIn,
    logInController.post,
    passport.authenticate('local', logInAuthOptions)
);

// ======================== LOG OUT ========================

router.get('/log-out', isAuth, logOutController.get);

// ======================== JOIN ========================

router.get('/join', isAuth, joinController.get);
router.post('/join', isAuth, validation.validateJoin, joinController.post);

module.exports = router;
