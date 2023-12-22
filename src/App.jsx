import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Login successful')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Wrong username/password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setSuccessMessage('Logged out')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
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

  const removeBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
    blogService.remove(id)
  }

  const likeBlog = (id) => {
    const newBlogs = structuredClone(blogs)
    const idx = blogs.findIndex(blog => blog.id === id)
    const newBlog = {
      ...blogs[idx],
      likes: blogs[idx].likes + 1
    }
    newBlogs[idx] = newBlog
    blogService.update(id, newBlog)
    setBlogs(newBlogs)
  }

  const blogList = () => {
    blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} rmBlog={removeBlog} user={user}/>
        )}
      </div>
    )
  }

  const createBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(`Created new blog: ${blogObject.title} by ${blogObject.author}`)
    blogFormRef.current.toggleVisibility()
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  return (
    <div>
      <Notification message={successMessage} className='success'/>
      <Notification message={errorMessage} className='error'/>
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={() => handleLogout()}>logout</button></p>
        <Togglable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm
            createBlog={createBlog}
          >
          </BlogForm>
        </Togglable>
        {blogList()}
      </div>
      }
    </div>
  )
}

export default App