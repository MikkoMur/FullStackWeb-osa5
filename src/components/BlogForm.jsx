const BlogForm = (props) => {
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={props.submit}>
        <div>
          Title: <input type="text" value={props.title} onChange={({ target }) => props.setTitle(target.value)}></input>
        </div>
        <div>
          Author: <input type="text" value={props.author} onChange={({ target }) => props.setAuthor(target.value)}></input>
        </div>
        <div>
          Url: <input type="text" value={props.url} onChange={({ target }) => props.setUrl(target.value)}></input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm