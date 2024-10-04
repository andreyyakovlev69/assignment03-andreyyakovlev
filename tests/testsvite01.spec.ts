import { test, expect } from '@playwright/test';

test.describe('Front-End Tests', () => {
  test('TC01', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await expect(page.getByRole('heading', {name: 'Tester Hotel Overview'})).toBeVisible;

  });

});

test.describe('Back-End Tests', () => {
  test('TC01', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/login',{
      data: {
        "username": `${process.env.TEST_USERNAME}`,
        "password": `${process.env.TEST_PASSWORD}`
      }
    });
    expect (response.ok()).toBeTruthy();
  });

});