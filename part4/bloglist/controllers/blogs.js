const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs)
    } catch (err) {
        response.status(500).json({ error: 'Failed to fetch blogs' })
    }
})

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (err) {
        next(err)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body
        // console.log('POST /api/blogs body:', body)
        // console.log('JWT SECRET:', process.env.SECRET)
        const token = request.token
        console.log('Token extracted:', token)

        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }


        if (body.title && body.url) {
            const user = await User.findById(decodedToken.id)
            if (!user) {
                return response.status(401).json({ error: "user not found" })
            }

            const blog = new Blog({
                ...body,
                likes: body.likes || 0,
                user: user._id
            })

            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()

            response.status(201).json(savedBlog)
        } else {
            response.status(400).end()
        }
    } catch (err) {
        next(err)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (err) {
        next(err)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {

    try {
        const { title, author, url, likes } = request.body
        const updated = await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
        )

        if (!updated) {
            return response.status(404).end()
        }

        response.json(updated)
    } catch (err) {
        next(err)
    }

})


module.exports = blogsRouter