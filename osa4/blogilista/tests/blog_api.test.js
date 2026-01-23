const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const assert = require('node:assert')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog contains id, not _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    
    blogs.forEach(blog => {
        assert.ok(blog.id)
        assert.ok(!blog._id)
    })
})

test('blogs can be posted', async () => {
    const newBlog = {
        _id: "5a422aa71b54a676234d17f9",
      title: "Test Blog",
      author: "Kalle K.",
      url: "testurl.com",
      likes: 10,
      __v: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const titles = blogsAtEnd.map(b => b.title)

    assert(titles.includes('Test Blog'))
})

test('blog with no like value should be 0', async () => {
    const newBlog = {
        _id: "5a422aa71b54a676234d17f9",
      title: "Test Blog",
      author: "Kalle K.",
      url: "testurl.com",
      __v: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.deepStrictEqual(addedBlog.likes, 0)
})

test('blog with no title or url gives 400 bad request', async () => {
    const blogNoTitle = {
        _id: "5a422aa71b54a676234d17f9",
      author: "Kalle K.",
      url: "testurl.com",
      __v: 0,
    }

    const blogNoUrl = {
        _id: "5a422aa71b54a676234d17f9",
        title: "Test Blog",
      author: "Kalle K.",
      __v: 0,
    }

    await api
        .post('/api/blogs')
        .send(blogNoTitle)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    await api
        .post('/api/blogs')
        .send(blogNoUrl)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('deletion of blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(n => n.id)
    
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('update of blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[0]

    const content = {
        likes: 5
    }

    assert.notStrictEqual(blogToChange.likes, content.likes)

    await api
        .put(`/api/blogs/${blogToChange.id}`)
        .send(content)

    const blogAtEnd = await helper.blogsInDb()
    const updatedBlog = blogAtEnd.find(b => b.id === blogToChange.id)
    
    assert.strictEqual(updatedBlog.likes, content.likes)
})

after(async () => {
  await mongoose.connection.close()
})