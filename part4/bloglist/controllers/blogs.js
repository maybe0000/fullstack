const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
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
        if (request.body.title && request.body.url) {
            const blog = new Blog({ ...request.body, likes: request.body.likes || 0 })
            const savedBlog = await blog.save()
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