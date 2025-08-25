import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog
let mockHandler

beforeEach(() => {
  blog = {
    title: 'Testing title of the blog',
    author: 'Author Example',
    url: 'https://www.example.com',
    likes: 123,
    user: { username: 'exampleuser' }
  }

  mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} handleDelete={mockHandler} />
  )

})

test('renders blog title and author', () => {
  expect(screen.getByText('Testing title of the blog Author Example')).toBeDefined()
  expect(screen.queryByText('https://www.example.com')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})

test('clicking the button shows the url and number of likes', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('https://www.example.com')).toBeDefined()
  expect(screen.getByText(/likes 123/i)).toBeDefined()
})