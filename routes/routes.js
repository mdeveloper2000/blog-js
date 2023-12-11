const { Router } = require("express")
const authController = require("../controllers/authorizationController")
const homeController = require("../controllers/homeController")
const articleController = require("../controllers/articleController")
const commentController = require("../controllers/commentController")
const likeController = require("../controllers/likeController")
const { requireAuthorization, checkUser } = require("../middleware/authorizationMiddleware")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },    
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + '.jpg')
    }    
})

const upload = multer({
    storage,
    fileFilter : (req, file, cb) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png']
        cb(null, allowed.includes(file.mimetype))
    },
    limits: {
        fieldSize: 1000000
    }    
})

const router = Router()

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.get('/article/:id', requireAuthorization, checkUser, articleController.article_get)
router.get('/article/like/:id', requireAuthorization, articleController.article_like)
router.get('/articles/:search', articleController.articles_search)
router.post('/comment/make', requireAuthorization, commentController.comment_make)
router.get('/comment/delete/:id/:singlepage', commentController.comment_delete)
router.get('/comments', commentController.comments_all)
router.get('/likes', checkUser, likeController.likes_all)
router.get('/dislike/:like_id/:article_id', likeController.like_dislike)
router.get('/pictures', homeController.pictures_get)
router.post('/picture', checkUser, upload.single('picture'), homeController.picture_post)
router.get('/settings', homeController.settings_get)
router.get('/', homeController.home_get)
router.get('*', checkUser, homeController.error_404)

module.exports = router