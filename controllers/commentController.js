const Comment = require("../models/Comment")
const Article = require("../models/Article")
const moment = require("moment")

const comment_make = async (req, res, next) => {

    try {               
        const { text, user_id, article_id } = req.body        
        const comment = await Comment.create({ text, user_id, article_id })
        const article = await Article.findById({_id: article_id})
        article.comments = article.comments + 1
        article.save()
        const commentSaved = await Comment.findOne({_id: comment._id}).populate('user_id')
        const dataFormatted = moment(commentSaved.date).format('DD/MM/YYYY - hh:mm:ss')
        res.status(201).json({commentSaved, dataFormatted})
    }    
    catch (error) {        
        res.status(400).json({error})
    }
    
}

const comment_delete = async (req, res) => {
    
    try {
        const id = req.params.id
        const singlepage = req.params.singlepage        
        const comment = await Comment.findById({ _id: id })
        const article_id = comment.article_id
        const article = await Article.findOne({_id: article_id})        
        const deleted = await comment.deleteOne({ _id : id })
        article.comments = article.comments - 1
        article.save()
        if(deleted && parseInt(singlepage) === 1) {
            res.redirect('/article/' + article_id)
        }
        else if(deleted && parseInt(singlepage) === 2) {
            res.redirect('/comments')
        }
    }
    catch(error) {
        console.log(error)
        res.status(201).send({"error:": 1})
    }

}

const comments_all = async (req, res) => {
    const comments = await Comment.find({user_id: res.locals.userID}).sort({date: 'desc'}) 
    res.render('comments', { page: 'Comments', user_id: res.locals.userID, comments, moment })
}

module.exports = {
    comment_make,
    comment_delete,
    comments_all
}