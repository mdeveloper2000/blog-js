const Article = require("../models/Article")
const Comment = require("../models/Comment")
const Like = require("../models/Like")
const moment = require("moment")

const article_get = async(req, res) => {
    if(!res.locals.userID) {        
        res.redirect('/')
        next()
    }
    else {
        try {
            const article = await Article.findById({_id: req.params.id})
            const comments = await Comment.find({article_id: req.params.id}).sort({date: 'desc'}).populate('user_id')
            article.views = article.views + 1
            article.save()
            let like = await Like.findOne({article_id: req.params.id, user_id: res.locals.userID})            
            if(like && like.liked == true) {
                const iliked = true
                res.render('article', { page: 'Article', article, comments, iliked, moment})
            }
            else {
                const iliked = false
                res.render('article', { page: 'Article', article, comments, iliked, moment})
            }
        }
        catch(error) {
            console.log(error)
        }
    }
    
}

const article_like = async (req, res) => {

    const article_id = req.params.id
    
    if(!res.locals.userID) {
        console.log(err.message)
        res.redirect('/')
        next()
    }
    else {
        const article = await Article.findOne({_id: article_id})
        const like = await Like.findOne({user_id: res.locals.userID, article_id: article_id})
        let iliked = false
        if(like) {
            if(like.liked === true) {
                like.liked = false
                article.likes = article.likes - 1                
            }
            else {
                like.liked = true
                article.likes = article.likes + 1
                iliked = true
            }                    
            like.save()
            article.save()
            res.status(201).json({liked: like.liked})
        }
        else {            
            const like = await Like.create({ liked: true, user_id: res.locals.userID, article_id })
            article.likes = article.likes + 1
            iliked = true
            like.save()
            article.save()
            res.status(201).json({liked: like.liked})
        }
        
    }    
    
}

const articles_search = async (req, res) => {
    const search = req.params.search    
    const articles = await Article.find({ tags: new RegExp(search, 'i') }).limit(8)
    res.send(articles)
}

module.exports = {
    article_get,
    article_like,
    articles_search
}