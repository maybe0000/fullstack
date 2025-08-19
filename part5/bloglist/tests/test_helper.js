const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
    {
        'title': 'Blog post 1',
        'author': 'Jane Doe',
        'url': 'http://www.google.com',
        'likes': 4
    },
    {
        'title': 'Blog post 2',
        'author': 'John Doe',
        'url': 'http://www.google.com',
        'likes': 23123
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

async function createAndLoginTestUser(api, username = 'testuser', password = 'tajno') {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, passwordHash })

    await user.save()

    const loginResponse = await api
        .post('/api/login')
        .send({
            username,
            password
        })

    const token = loginResponse.body.token

    return token
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb, createAndLoginTestUser
}