import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blogProp, rmBlog, user }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [blog, setBlog] = useState(blogProp)
  const baseInfo = () => {
    return (
      <>
        {blog.title} {blog.author}
      </>
    )
  }

  const like = () => {
    const newBlogObject = {
      ...blog,
      likes: blog.likes + 1
    }
    blogService.update(blog.id, newBlogObject)
    setBlog(newBlogObject)
  }

  const remove = () => {
    if (window.confirm(`remove blog ${blog.title}?`))
    {
      blogService.remove(blog.id)
      rmBlog(blog.id)
    }
  }

  const extraInfo = () => {
    return (
      <>
      <br/>
        {blog.url}
      <br/>
        likes: {blog.likes} <button onClick={like}>like</button>
      <br/>
        {blog.user.name}
      <br/>
        {blog.user.username == user.username && <button onClick={remove}>remove</button> }
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