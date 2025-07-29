const dummy = blogs => 1;

const totalLikes = blogs => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }
    if (blogs.length === 1) {
        return blogs[0]
    }
    let blogIndex = 0
    let count = 0
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > count) {
            blogIndex = i
            count = blogs[i].likes
        }
    }
    return blogs[blogIndex]
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }
    let blogIndex = 0
    let blogMap = new Map()
    for (let i = 0; i < blogs.length; i++) {
        const author = blogs[i].author

        if (blogMap.has(author)) {
            blogMap.set(author, blogMap.get(author) + 1)
        } else {
            blogMap.set(author, 1)
        }

    }

    const maxBlogs = [...blogMap].reduce((max, blog) => blog[1] > max[1] ? blog : max)

    return {
        author: maxBlogs[0],
        blogs: maxBlogs[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}