const { validationResult } = require('express-validator');
const getUserStatus = require('../lib/user-status').getUserStatus;
const User = require('../models/user-model');

exports.get = (req, res, next) => {
    res.render('join', {
        title: 'Join the club',
        status: getUserStatus(req),
    });
};

const handleErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    const errors = validationErrors.isEmpty() ? [] : validationErrors.array();

    if (req.body.secret !== 'monkeyslut') {
        const error = new Error('Incorrect secret passcode.');
        errors.push(error);
    }

    if (errors.length > 0) {
        res.render('join', {
            title: 'Join the club',
            status: getUserStatus(req),
            errors,
        });

        return true
    }
};

exports.post = async (req, res, next) => {
    const isErrors = handleErrors(req, res, next);

    if (isErrors) return;

    await User.findOneAndUpdate(
        { username: req.user.username },
        { member: true }
    );

    res.redirect('/');
};
