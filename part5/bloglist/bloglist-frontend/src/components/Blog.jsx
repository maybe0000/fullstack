import { useState } from 'react'

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={handleClick}>{isClicked ? 'hide' : 'view'}</button>
      {isClicked &&
        <div>
          {blog.url}
          <br />
          {blog.likes}
          <br />
          {blog.user.username}
        </div>
      }
    </div>
  )
}

export default Blog