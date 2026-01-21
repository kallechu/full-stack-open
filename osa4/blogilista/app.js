const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require("./controllers/blogs")

const app = express()

const mongoUrl = 'mongodb+srv://fullstack:qB5bkMRyu2fOsZRt@cluster0.1dyjo7n.mongodb.net/noteApp?appName=Cluster0'
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app