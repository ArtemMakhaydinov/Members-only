const mongoose = require('mongoose');

require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

const connection = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

module.exports = connection;
