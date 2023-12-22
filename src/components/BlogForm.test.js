import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title here')
  const authorInput = screen.getByPlaceholderText('author here')
  const urlInput = screen.getByPlaceholderText('url here')

  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'A title')
  await user.type(authorInput, 'An author')
  await user.type(urlInput, 'A url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('A title')
  expect(createBlog.mock.calls[0][0].author).toBe('An author')
  expect(createBlog.mock.calls[0][0].url).toBe('A url')
})