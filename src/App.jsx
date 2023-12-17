import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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

  const blogList = () => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  const submitBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(`Created new blog: ${title} by ${author}`)
    setTitle('')
    setAuthor('')
    setUrl('')
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
          <BlogForm 
            submit={submitBlog}
            title={title}
            author={author}
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
          >
          </BlogForm>
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App