const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: 'Username or password cant be blank'})
    }

    if (username.length < 3) {
        return response.status(400).json({ error: 'Username must be atleast 3 characters' })
    }

    if (password.length < 3) {
        return response.status(400).json({ error: 'Password must be atleast 3 characters' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        hashedPassword
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = userRouter