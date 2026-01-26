const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async  (request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    
    if (!user) {
        return response.status(404).json({ error: 'UserId missing or not valid'})
    }

    const checkLikes = 'likes' in body
    const checkTitle = 'title' in body
    const checkUrl = 'url' in body

    if (checkTitle === false || checkUrl === false) {
        return response.status(400).json({ error:"title and url required"}) 
    } else if (checkLikes === false) {
        body.likes = 0
    }

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        user: user._id,
        likes: body.likes
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    console.log(request.user)
    const blogId = request.params.id

    const user = request.user

    const blogs = user.blogs.map(b => b.toString())
    
    if (blogs.includes(blogId)) {
        await Blog.findByIdAndDelete(blogId)
        return response.status(204).end()
    } else {
        return response.status(403).json({ error: 'not your blog'})
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const blog = await Blog.findById(request.params.id)

    blog.likes = likes 

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter