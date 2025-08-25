import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogs.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setMsgType('success')
      blogFormRef.current.toggleVisibility()
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    } catch (err) {
      setMessage('Failed to add blog')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username,
        password
      })

      blogService.setToken(user.token)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      setUser(user)
    } catch (exception) {
      setMessage('Wrong credentials')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    }
  }

  const updateBlogLikes = async (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id)
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)))
    } catch (err) {
      setMessage('Error updating likes')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id)
    try {
      if (
        window.confirm(
          `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`
        )
      ) {
        await blogService.remove(id)
        setBlogs(blogs.filter((b) => b.id !== id))
      }
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setMessage('Unauthorized to delete this blog')
      } else {
        setMessage('Failed to delete blog')
      }
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={message} msgType={msgType} />
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <Togglable buttonLabel='login' ref={blogFormRef}>
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        </div>
      ) : (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in
            <LogoutButton handleLogout={handleLogout} />
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <br />
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={() => updateBlogLikes(blog.id)}
                handleDelete={() => removeBlog(blog.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
