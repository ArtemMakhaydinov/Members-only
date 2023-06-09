const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    member: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
