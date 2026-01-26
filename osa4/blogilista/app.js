const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require("./controllers/blogs")
const userRouter = require('./controllers/users')
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

module.exports = app