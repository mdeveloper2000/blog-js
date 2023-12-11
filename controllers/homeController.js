const Article = require("../models/Article")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const path = require("path")
const fs = require("fs")

const home_get = async (req, res) => {
    try {
        const articles = await Article.find({}).sort({date: 'desc'}).limit(3)
        res.render('home', { page: 'Home', articles, moment })
    }
    catch(error) {
        console.log(error)
    }
}

const pictures_get = async (req, res) => {
    res.render('pictures', { page: 'Pictures' })
}

const picture_post = async (req, res) => {
    const file = req.file;
    if(file !== undefined) {
        const user = await User.findOne({_id: res.locals.userID})
        if(user) {
            if(user.picture != 'default.jpg') {                
                fs.unlink(path.resolve('./public/uploads/' + user.picture), (err) => {
                    console.log(err)
                })
            }
        }
        await User.updateOne({_id: res.locals.userID}, {
            picture: req.file.filename
        })
        res.locals.picture = req.filename        
    }       
    res.json("ok")
}

const settings_get = (req, res) => {
    res.render('settings', { page: 'Settings' })
}

const error_404 = (req, res) => {
    res.render('404', { page: '404' })
}

module.exports = {
    home_get,
    pictures_get,
    picture_post,
    settings_get,
    error_404
}