const dummy = blogs => 1;

const totalLikes = blogs => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null;
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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}