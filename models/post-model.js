const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
    text: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.virtual('date_formatted').get(function() {
    return DateTime.fromJSDate(this.date).toFormat('D T')
})

module.exports = mongoose.model('Post', PostSchema);
