const { body } = require('express-validator');

const checkPassConfirm = (value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Password confirmation must match the password.');
    }
    return true;
};

exports.validateSignUp = [
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('password', 'Password must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('confirmPassword').trim().custom(checkPassConfirm),
];

exports.validateLogIn = [
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('password', 'Password must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
];

exports.validateJoin = [
    body('secret', 'Secret passcode must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
];

exports.validatePost = [
    body('post', 'Post must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
];

exports.validateDelete = [
    body('postId')
        .trim()
        .escape(),
];
