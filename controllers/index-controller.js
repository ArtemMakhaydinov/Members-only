const Post = require('../models/post-model');
const getUserStatus = require('../lib/user-status').getUserStatus;
const { validationResult } = require('express-validator');

const getTitle = (req) => {
    let title = '';

    if (req.user) {
        if (req.user.member) {
            title = `Hi, ${req.user.username}! Welcome to Clubhouse!`;
        } else {
            title = `Hi, ${req.user.username}! Welcome to Clubhouse! Join the club to see nickname and date under posts.`;
        }
    } else {
        title = 'Welcome to Clubhouse! Please log in.';
    }

    return title;
};

const getPosts = async (req) => {
    let posts;
    const status = getUserStatus(req);

    if (status.isMember) {
        posts = await Post.find({})
            .populate('author', 'username')
            .sort({ date: -1 })
            .exec();
    } else {
        posts = await Post.find({}, 'text').sort({ date: -1 }).exec();
    }

    return posts;
};

exports.get = async (req, res, next) => {
    const title = getTitle(req);
    const status = getUserStatus(req);
    const posts = await getPosts(req);

    res.render('index', {
        title,
        posts,
        status,
    });
};

const handleErrors = async (req, res, next) => {
    const validationErrors = validationResult(req);
    const errors = validationErrors.isEmpty() ? [] : validationErrors.array();

    if (errors.length > 0) {
        const title = getTitle(req);
        const status = getUserStatus(req);
        const posts = await getPosts(req);

        res.render('/', {
            title,
            posts,
            status,
            errors,
        });

        return true;
    }
};

exports.post = async (req, res, next) => {
    const isErrors = await handleErrors(req, res, next);

    if (isErrors) return;

    const post = new Post({
        text: req.body.post,
        author: req.user._id,
    });

    try {
        await post.save();
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await Post.findByIdAndRemove(req.body.postId);
        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};
