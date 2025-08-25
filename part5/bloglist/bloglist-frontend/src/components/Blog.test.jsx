import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'Testing title of the blog',
    author: 'Author Example',
    url: 'https://www.example.com',
    likes: 123,
    user: { username: 'exampleuser' }
  }

  const mockHandler = vi.fn()

  const { container } = render(
    <Blog blog={blog} handleLike={mockHandler} handleDelete={mockHandler} />
  )

  // console.log(container.innerHTML)

  // console.log(container.textContent)

  expect(screen.getByText('Testing title of the blog Author Example')).toBeDefined()
  expect(screen.queryByText('https://www.example.com')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})