import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import LogoutButton from './components/LogoutButton'
import Notification from './components/Notification'
import './index.css'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs(initialBlogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({
          title: '',
          author: '',
          url: '',
          likes: 0
        })
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setMsgType('success')
        setTimeout(() => {
          setMessage(null)
          setMsgType(null)
        }, 5000)
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

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setMsgType('error')
      setTimeout(() => {
        setMessage(null)
        setMsgType(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
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

  return (
    <div>
      <Notification message={message} msgType={msgType} />
      {user === null
        ? <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div>
        : <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in<LogoutButton handleLogout={handleLogout} /></p>
          {blogForm()}
          <br />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App