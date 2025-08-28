import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(!isClicked)
  }

  console.log(user)
  console.log(blog)

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={handleClick}>{isClicked ? 'hide' : 'view'}</button>
      {isClicked && (
        <div>
          <a href={blog.url} target='_blank' rel="noreferrer">
            {blog.url}
          </a>
          <br />
          likes {blog.likes} <button onClick={handleLike}>like</button>
          <br />
          {blog.user.username}
          <br />
          {user.username === blog.user.username &&
          (<button onClick={handleDelete}>remove</button>)}
        </div>
      )}
    </div>
  )
}

export default Blog
