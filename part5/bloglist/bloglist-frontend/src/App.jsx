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

  const blogFormRef = useRef()

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
        blogFormRef.current.toggleVisibility()
        setTimeout(() => {
          setMessage(null)
          setMsgType(null)
        }, 5000)
      })
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
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

  return (
    <div>
      <Notification message={message} msgType={msgType} />
      {user === null
        ? <div>
          <h2>log in to application</h2>
          <Togglable buttonLabel='login' ref={blogFormRef}>
            <LoginForm
              handleLogin={handleLogin}
              handlePasswordChange={handlePasswordChange}
              handleUsernameChange={handleUsernameChange}
              username={username}
              password={password}
            />
          </Togglable>
        </div>
        : <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in<LogoutButton handleLogout={handleLogout} /></p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm
              addBlog={addBlog}
              newBlog={newBlog}
              handleBlogChange={handleBlogChange}
            />
          </Togglable>
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