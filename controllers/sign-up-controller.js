const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const genSaltHash = require('../lib/password-utils').genSaltHash;

exports.get = (req, res, next) => {
    res.render('sign-up', { title: 'Sign up' });
};

const handleErrors = async (req, res, next, user) => {
    const validationErrors = validationResult(req);
    const errors = validationErrors.isEmpty() ? [] : validationErrors.array();
    const repeat = await User.findOne({ username: user.username }).exec();

    if (repeat) {
        const repeatError = new Error('User with provided name already exist.');
        errors.push(repeatError);
    }

    if (errors.length > 0) {
        res.render('sign-up', {
            title: 'Sign up',
            user,
            errors,
        });

        return true;
    }
};

exports.post = async (req, res, next) => {
    const { username, password } = req.body;
    const { salt, hash } = genSaltHash(password);

    const user = new User({
        username,
        salt,
        hash,
    });

    const isErrors = await handleErrors(req, res, next, user);

    if (isErrors) return;

    try {
        const savedUser = await user.save();
    } catch (err) {
        return next(err);
    }

    res.redirect('/log-in');
};
