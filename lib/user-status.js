const getUserStatus = (req) => {
    const status = {
        isAuth: false,
        isMember: false,
        isAdmin: false,
    };

    if (req.isAuthenticated()) {
        status.isAuth = true;

        if (req.user.member) status.isMember = true;
        if (req.user.admin) status.isAdmin = true;
    }

    return status;
};

const isAuthMiddleware = (req, res, next) => {
    const status = getUserStatus(req);

    if (!status.isAuth) {
        return res.status(401).render('access-error', { error: 'You are not authenticated.'});
    }

    next();
};

const isAdminMiddleware = (req, res, next) => {
    const status = getUserStatus(req);

    if (!status.isAdmin) {
        return res.status(401).render('access-error', { error: 'You are not administrator.'});
    }

    next();
}

module.exports.getUserStatus = getUserStatus;
module.exports.isAuthMiddleware = isAuthMiddleware;
