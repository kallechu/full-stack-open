const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async  (request, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const checkLikes = 'likes' in body
    const checkTitle = 'title' in body
    const checkUrl = 'url' in body
    if (checkTitle === false || checkUrl === false) {
        return response.status(400).json({ error:"title and url required"}) 
    } else if (checkLikes === false) {
        body.likes = 0
    }
    const blog = new Blog(body)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const blog = await Blog.findById(request.params.id)

    blog.likes = likes 

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter