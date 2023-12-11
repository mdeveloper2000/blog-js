const mongoose = require("mongoose")
const User = require("../models/User")

const Comment = mongoose.model('Comment', new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
}))

module.exports = Comment