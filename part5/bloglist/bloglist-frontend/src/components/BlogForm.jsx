const BlogForm = ({
    addBlog,
    newBlog,
    handleBlogChange
}) => (
    <form onSubmit={addBlog}>
        <h3>Create a new blog</h3>
        <div className="blogFormEl">title<input
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
        />
        </div>
        <div className="blogFormEl">author<input
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
        />
        </div>
        <div className="blogFormEl">url<input
            name="url"
            value={newBlog.url}
            onChange={handleBlogChange}
        />
        </div>
        <button type="submit">create</button>
    </form>
)

export default BlogForm