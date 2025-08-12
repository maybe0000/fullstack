const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(e => e.title)
        assert(titles.includes('Blog post 1'))
    })
})

describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
})

describe('addition of a new blog', () => {
    beforeEach(async () => {
        token = await helper.createAndLoginTestUser(api)
    })

    test('a valid blog can be added', async () => {
        const user = await User.findOne({ username: 'testuser' })
        const newBlog = {
            "title": "Blog post 3",
            "author": "La la",
            "url": "http://www.google.com",
            "likes": 1232323,
            "userId": user.id
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert(titles.includes('Blog post 3'))
    })

    // test('blog without title is not added', async () => {
    //     const newBlog = {
    //         "author": "La la",
    //         "url": "http://www.google.com",
    //         "likes": 1232323
    //     }

    //     await api
    //         .post('/api/blogs')
    //         .send(newBlog)
    //         .expect(400)

    //     const blogsAtEnd = await helper.blogsInDb()

    //     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    // })

    test('adding a blog without title or url results in bad request', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const newBlogWithoutTitle = {
            "author": "La la",
            "url": "http://www.google.com",
            "likes": 1232323
        }

        const newBlogWithoutUrl = {
            "title": "A title",
            "author": "La la",
            "likes": 1232323
        }

        const resNoTitle = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutTitle)
            .expect(400)

        const resNoUrl = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutUrl)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

    })

})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(b => b.title)

        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

})


test('unique identifier property is named id and not _id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)

    response.body.forEach(blog => {
        assert.ok(blog.hasOwnProperty('id'), 'Missing id property')
        assert.ok(!blog.hasOwnProperty('_id'), 'Should not expose _id property')
    })

})

describe('updating a blog', () => {

    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedData = {
            ...blogToUpdate,
            likes: (blogToUpdate.likes || 0) + 1
        }

        const res = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(res.body.likes, updatedData.likes)

        const blogsAtEnd = await helper.blogsInDb()
        const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)

        assert.strictEqual(updated.likes, updatedData.likes)
    })
})

describe('data quality of properties', () => {
    beforeEach(async () => {
        token = await helper.createAndLoginTestUser(api)
    })

    test('if likes property is missing from a request, it will default to 0', async () => {
        const user = await User.findOne({ username: 'testuser' })

        const newBlog = {
            "title": "Testing title",
            "author": "La la",
            "url": "http://www.google.com",
            "userId": user.id
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'smarkic',
            name: 'Sara Markic',
            password: 'tajno'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'tajno'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('invalid user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        await new User({ username: 'root', passwordHash }).save()
    })

    test('fails with 400 if username is missing', async () => {
        const newUser = { name: 'No Username', password: 'validpass' }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username is required'))
    })

    test('fails with 400 if username is shorter than 3 chars', async () => {
        const newUser = { username: 'ab', name: 'Too Short', password: 'validpass' }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username must be at least 3 characters long'))
    })

    test('fails with 400 if password is missing', async () => {
        const newUser = { username: 'validuser', name: 'No Password' }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))
    })

    test('fails with 400 if password is shorter than 3 chars', async () => {
        const newUser = { username: 'validuser', name: 'Short Password', password: 'ab' }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))
    })
})


after(async () => {
    await mongoose.connection.close()
})