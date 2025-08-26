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

  })

})