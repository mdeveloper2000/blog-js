const jwt = require("jsonwebtoken")
const User = require("../models/User")

const requireAuthorization = (req, res, next) => {
    const token = req.cookies.jwt    
    if(token) {
        jwt.verify(token, 'jwt', (err, decodedToken) => {
            if(err) {
                res.redirect('/')                
            }
            else {                
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'jwt', async (err, decodedToken) => {
            if(err) {
                res.locals.user = null
                res.locals.userID = null
                res.locals.picture = null
                next()
            }
            else {
                const user = await User.findById(decodedToken.id)
                res.locals.user = user.username
                res.locals.userID = user._id
                res.locals.picture = user.picture
                next()
            }
        })
    }
    else {
        res.locals.user = null
        res.locals.userID = null
        res.locals.picture = null
        next()
    }
}

module.exports = { 
    requireAuthorization, 
    checkUser
}