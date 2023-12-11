const mongoose = require("mongoose")

const Like = mongoose.model('Like', new mongoose.Schema({
    liked: {
        type: Boolean,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
}))

module.exports = Like