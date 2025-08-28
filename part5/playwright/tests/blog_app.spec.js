const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
        data: {
            name: 'Sara Markic',
            username: 'smarkic',
            password: 'tajno'
        }
    })
    await request.post('/api/users', {
        data: {
          name: 'Root User',
          username: 'root',
          password: 'tajno'
        }
    })

    await page.goto('/')
  })

test('Login form is shown', async ({ page }) => {
      const locator = page.getByText('log in to application')
      await expect(locator).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
      
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'smarkic', 'tajno')
        await expect(page.getByText('Sara Markic logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'smarkic', 'wrong')
        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Sara Markic logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
        await loginWith(page, 'smarkic', 'tajno')
    })
  
    test('a new blog can be created', async ({ page }) => {
        await expect(page.getByText('Blogs')).toBeVisible()

        await createBlog(page, 'Test Title','Test Author','http://example.com')
        await expect(page.getByText(`a new blog Test Title by Test Author added`)).toBeVisible()
    
        await expect(page.getByText('Test Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await createBlog(page, 'Test Title','Test Author','http://example.com')
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added blog can delete the blog', async ({ page }) => {
        await expect(page.getByText('Blogs')).toBeVisible()
        await createBlog(page, 'Test Title','Test Author','http://example.com')
        page.once('dialog', async (dialog) => await dialog.accept())
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Test Title Test Author')).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page }) => {
        await expect(page.getByText('Blogs')).toBeVisible()
        await createBlog(page, 'Unable to delete', 'Author', 'http://example.com')
        await expect(page.getByText(`a new blog Unable to delete by Author added`)).toBeVisible()
    
        await page.getByRole('button', { name: 'logout' }).click()

        const locator = page.getByText('log in to application')
        await expect(locator).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

        await loginWith(page, 'root', 'tajno')
        await expect(page.getByText('Blogs')).toBeVisible()
        await expect(page.getByText(`a new blog Unable to delete by Author added`)).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        const removeButton = page.getByRole('button', { name: 'remove' })
        await expect(removeButton).toHaveCount(0)
    })

    test('blogs are arranged in the order according to descending likes', async ({ page }) => {
        await expect(page.getByText('Blogs')).toBeVisible()
        await createBlog(page, 'Blog 1', 'Author', 'http://example.com')
        await expect(page.getByText(`a new blog Blog 1 by Author added`)).toBeVisible()

        await createBlog(page, 'Blog 2', 'Author', 'http://example.com')
        await expect(page.getByText(`a new blog Blog 2 by Author added`)).toBeVisible()

        await createBlog(page, 'Blog 3', 'Author', 'http://example.com')
        await expect(page.getByText(`a new blog Blog 3 by Author added`)).toBeVisible()

        const blog = title => page.locator('.blog').filter({ hasText: title });

        const blog1 = blog('Blog 1')
        const viewButton1 = blog1.getByRole('button', { name: 'view' });
        await viewButton1.click();
        const likeButton1 = blog1.getByRole('button', { name: 'like' });
        await likeButton1.click();
        await expect(blog('Blog 1').getByText('likes 1')).toBeVisible()
        await likeButton1.click();
        await expect(blog('Blog 1').getByText('likes 2')).toBeVisible()

        const blog2 = blog('Blog 2')
        const viewButton2 = blog2.getByRole('button', { name: 'view' });
        await viewButton2.click();
        const likeButton2 = blog2.getByRole('button', { name: 'like' });
        await likeButton2.click();
        await expect(blog('Blog 2').getByText('likes 1')).toBeVisible()
        await likeButton2.click();
        await expect(blog('Blog 2').getByText('likes 2')).toBeVisible()
        await likeButton2.click();
        await expect(blog('Blog 2').getByText('likes 3')).toBeVisible()

        const blog3 = blog('Blog 3')
        const viewButton3 = blog3.getByRole('button', { name: 'view' });
        await viewButton3.click();
        const likeButton3 = blog3.getByRole('button', { name: 'like' });
        await likeButton3.click();
        await expect(blog('Blog 3').getByText('likes 1')).toBeVisible()

        const blogs = page.locator('.blog');

        const firstBlog = blogs.nth(0);
        const secondBlog = blogs.nth(1);
        const thirdBlog = blogs.nth(2);

        await expect(firstBlog).toContainText('Blog 2')
        await expect(secondBlog).toContainText('Blog 1')
        await expect(thirdBlog).toContainText('Blog 3')

    })

  })

})