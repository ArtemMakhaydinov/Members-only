const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const passwordUtils = require('../lib/password-utils');

exports.get = (req, res, next) => {
    res.render('log-in', { title: 'Log in' });
};

const handleErrors = (errors, req, res, next) => {
    if (errors === null) {
        const validationErrors = validationResult(req);
        errors = validationErrors.isEmpty() ? [] : validationErrors.array();
    }

    if (errors.length > 0) {
        res.render('log-in', {
            titile: 'Log in',
            user: { username: req.body.username },
            errors,
        });

        return true;
    }
};

exports.post = async (req, res, next) => {
    const isErrors = handleErrors(null, req, res, next);

    if (isErrors) return;

    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();

    if (!user) {
        const error = new Error("User with provided username doesn't exist.");
        return handleErrors([error], req, res, next);
    }

    const isPasswordValid = passwordUtils.validPassword(
        password,
        user.hash,
        user.salt
    );

    if (!isPasswordValid) {
        const error = new Error('Incorrect password.');
        return handleErrors([error], req, res, next);
    }

    next();
};
