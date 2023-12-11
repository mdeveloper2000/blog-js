const express = require("express")
const mongoose = require("mongoose")
const authorizationRoutes = require("./routes/routes")
const cookieParser = require("cookie-parser")
const { requireAuthorization, checkUser } = require("./middleware/authorizationMiddleware")

const app = express()

app.use(express.static("public"))
app.use(express.static("public/css"))
app.use(express.static("public/images"))
app.use(express.static("public/uploads"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.set("view engine", "ejs")

mongoose.set("strictQuery", true)
const dbURI = "mongodb://127.0.0.1:27017/blog-js"
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

app.get("*", checkUser)
app.use(authorizationRoutes)