const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        response.json(blogs)
    } catch (err) {
        console.log(err)
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

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {
        const body = request.body
        const user = request.user
        // console.log('POST /api/blogs body:', body)
        // console.log('JWT SECRET:', process.env.SECRET)
        if (!user) {
            return response.status(401).json({ error: 'user not found or token invalid' })
        }

        if (!body.title || !body.url) {
            return response.status(400).end()
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

    } catch (err) {
        next(err)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        const user = request.user

        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }

        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user.id) {
            return response.status(403).json({ error: 'only the blog creator can delete this blog' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (err) {
        next(err)
    }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {

    try {
        const { title, author, url, likes, user } = request.body
        const updated = await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes, user },
            { new: true, runValidators: true, context: 'query' }
        ).populate('user', { username: 1, name: 1 })

        if (!updated) {
            return response.status(404).end()
        }

        response.json(updated)
    } catch (err) {
        next(err)
    }

})


module.exports = blogsRouter