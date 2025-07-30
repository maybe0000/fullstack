const _ = require('lodash')

const dummy = blogs => 1;

const totalLikes = blogs => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }

    return _.maxBy(blogs, 'likes')

}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const grouped = _.groupBy(blogs, 'author')

    const blogsPerAuthor = _.map(grouped, (posts, author) => ({
        author,
        blogs: posts.length
    }))

    return _.maxBy(blogsPerAuthor, 'blogs')

}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const grouped = _.groupBy(blogs, 'author')

    const likesPerAuthor = _.map(grouped, (posts, author) => ({
        author,
        likes: _.sumBy(posts, 'likes')
    }))

    return _.maxBy(likesPerAuthor, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}