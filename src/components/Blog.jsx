import { useState } from 'react'

const Blog = ({ blog, rmBlog, likeBlog, user }) => {
  const [showInfo, setShowInfo] = useState(false)
  const baseInfo = () => {
    return (
      <div>
        {blog.title} {blog.author}
      </div>
    )
  }

  const like = () => {
    likeBlog(blog.id)
  }

  const remove = () => {
    if (window.confirm(`remove blog ${blog.title}?`))
    {
      rmBlog(blog.id)
    }
  }

  const extraInfo = () => {
    return (
      <>
        <div>
          {blog.url}
        </div>
        <div>
          likes: {blog.likes} <button onClick={like}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {blog.user.username === user.username && <button onClick={remove}>remove</button> }
        </div>
      </>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {baseInfo()}
      {!showInfo && <button onClick={() => setShowInfo(!showInfo)}>show</button>}
      {showInfo && <button onClick={() => setShowInfo(!showInfo)}>hide</button>}
      {showInfo && extraInfo()}
    </div>
  )
}

export default Blog