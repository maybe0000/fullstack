const dummy = blogs => 1;

const totalLikes = blogs => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((max, i) => i.likes > max.likes ? i : max)

}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }
    let blogMap = new Map()

    for (const { author } of blogs) {
        blogMap.set(author, (blogMap.get(author) || 0) + 1)
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