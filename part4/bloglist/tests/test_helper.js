const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "Blog post 1",
        "author": "Jane Doe",
        "url": "http://www.google.com",
        "likes": 4
    },
    {
        "title": "Blog post 2",
        "author": "John Doe",
        "url": "http://www.google.com",
        "likes": 23123
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

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}