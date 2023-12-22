import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    likes: 0,
    url: 'url',
    user: {}
  }

  render(<Blog blog={blog}/>)
  const element = screen.getByText('A title An author')
  expect(element).toBeDefined()
})

test('renders all information after "show" has been clicked', async () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    likes: 0,
    url: 'url',
    user: {
      name: 'a user',
      username: 'user1'
    }
  }

  render(<Blog blog={blog} user={ { username: 'user2' } }/>)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const titleAuthorElement = screen.getByText('A title An author')
  expect(titleAuthorElement).toBeDefined

  const hideButtonElement = screen.getByText('hide')
  expect(hideButtonElement).toBeDefined

  const urlElement = screen.getByText('url')
  expect(urlElement).toBeDefined

  const likesElement = screen.getByText('likes: 0')
  expect(likesElement).toBeDefined

  const userElement = screen.getByText('a user')
  expect(userElement).toBeDefined
})

test('calls the corresponding handler function twice when the "like" button is clicked twice', async () => {
  const blog = {
    title: 'A title',
    author: 'An author',
    likes: 0,
    url: 'url',
    user: {
      name: 'a user',
      username: 'user1'
    }
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={ { username: 'user2' } } likeBlog={ mockHandler }/>)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})