const crypto = require('crypto');

exports.genSaltHash = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto
        .pbkdf2Sync(password, salt, 100, 64, 'sha512')
        .toString('hex');

    return {
        salt,
        hash: genHash,
    };
};

exports.validPassword = (password, hash, salt) => {
    const hashVerify = crypto
        .pbkdf2Sync(password, salt, 100, 64, 'sha512')
        .toString('hex');
    return hash === hashVerify;
};
