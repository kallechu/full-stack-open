const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', { content: 1, important: 1 })

    response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const isValidUsername = /^[A-Za-z]+$/.test(username);

  if (!isValidUsername) {
    return response.status(400).json({ error: 'username must only contain letters'})
  }

  if (username.length < 8) {
    return response.status(400).json({ error: 'Username must be atleast 8 characters'})
  }

  if (password.length < 8) {
    return response.status(400).json({ error: 'Password must be atleast 8 characters'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter