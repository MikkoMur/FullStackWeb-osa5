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
          Title: <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title here'>
          </input>
        </div>
        <div>
        Author: <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author here'>
          </input>
        </div>
        <div>
        Url: <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='url here'>
          </input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm