import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submitBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    createBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={submitBlog}>
        <div>
          Title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)}></input>
        </div>
        <div>
          Author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}></input>
        </div>
        <div>
          Url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)}></input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm