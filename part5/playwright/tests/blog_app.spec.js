const { test, expect, beforeEach, describe } = require('@playwright/test')

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
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByLabel('username').fill('smarkic')
        await page.getByLabel('password').fill('tajno')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Sara Markic logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByLabel('username').fill('smarkic')
        await page.getByLabel('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Sara Markic logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    // verify that a logged in user can create a blog
    // ensure that the created blog is visible in the list of blogs

    beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByLabel('username').fill('smarkic')
        await page.getByLabel('password').fill('tajno')
        await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
        await expect(page.getByText('Blogs')).toBeVisible()

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill('Test Title')
        await page.getByPlaceholder('author').fill('Test Author')
        await page.getByPlaceholder('url').fill('http://example.com')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText(`a new blog Test Title by Test Author added`)).toBeVisible()
    
        await expect(page.getByText('Test Title Test Author')).toBeVisible()
    })
  })
})