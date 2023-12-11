const Like = require("../models/Like")
const Article = require("../models/Article")
const moment = require("moment")

const like_dislike = async (req, res) => {
    
    try {
        const article_id = req.params.article_id
        const like_id = req.params.like_id
        const like = await Like.findOne({ _id: like_id })
        const article = await Article.findById({ _id: article_id })
        article.likes = article.likes - 1
        article.save()
        like.liked = false
        like.save()
        const likes = await Like.find({user_id: res.locals.userID, liked: true}).sort({_id: 'desc'}).populate('article_id')
        res.json("done")
    }
    catch(error) {
        console.log(error)
        res.status(201).send({"error:": 1})
    }

}

const likes_all = async (req, res) => {    
    const likes = await Like.find({user_id: res.locals.userID, liked: true}).sort({_id: 'desc'}).populate('article_id')    
    res.render('likes', { page: 'Likes', user_id: res.locals.userID, likes, moment })
}

module.exports = {
    like_dislike,
    likes_all
}