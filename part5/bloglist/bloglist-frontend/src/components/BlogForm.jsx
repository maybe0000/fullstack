import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: '',
      likes: 0
    })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target

    setNewBlog({
      ...newBlog,
      [name]: value,
      likes: 0
    })
  }

  return (
    <form onSubmit={addBlog} className='formDiv'>
      <h3>Create a new blog</h3>
      <div className='blogFormEl'>
        title
        <input name='title' value={newBlog.title} onChange={handleBlogChange} placeholder='title'/>
      </div>
      <div className='blogFormEl'>
        author
        <input
          name='author'
          value={newBlog.author}
          onChange={handleBlogChange}
          placeholder='author'
        />
      </div>
      <div className='blogFormEl'>
        url
        <input name='url' value={newBlog.url} onChange={handleBlogChange} placeholder='url' />
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm
