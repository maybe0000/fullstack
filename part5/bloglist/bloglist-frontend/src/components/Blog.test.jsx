import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

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

test('clicking the like button twice calls event handler twice', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  
  expect(mockHandler.mock.calls).toHaveLength(2)

  //expect(mockHandler).toHaveBeenCalledTimes(2)
})

test('form calls the event handler with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing title...')
  await user.type(authorInput, 'testing author...')
  await user.type(urlInput, 'testing url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testing title...',
    author: 'testing author...',
    url: 'testing url...',
    likes: 0
  })
})