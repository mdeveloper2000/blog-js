const User = require("../models/User")
const jwt = require("jsonwebtoken")

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' }

    if(err.message === 'email/password error') {
        errors.email = 'Incorrect email and/or password'
    }    
    
    if(err.message === 'error') {
        errors.email = 'An error occurred trying to make login'
    }

    if(err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message 
        })
    }

    return errors

}

const signup_get = (req, res) => {
    res.render('signup', { page: 'Signup'})
} 

const login_get = (req, res) => {
    const cookies = req.cookies
    const email = cookies.email
    res.render('login', {
        email,
        page: 'Login'
    })
}

const signup_post = async (req, res) => {

    const { username, email, password } = req.body
    
    try {
        const user = await User.create({ username, email, password })        
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id})
    }
    catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
    
}

const login_post = async (req, res) => {
    
    const { email, password, saved } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        if(saved) {
            res.cookie('email', email, {maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true})
        }        
        res.status(200).json({ user: user._id })
    }
    catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({ errors })
    }

}

const maxAge = 1 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'jwt', {
        expiresIn: maxAge
    })
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}