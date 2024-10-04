import { test, expect } from '@playwright/test';
// import { TIMEOUT } from 'dns';

test.describe('Front-End Tests', () => {

  test.beforeEach(async ({page}) => {

    await page.goto('http://localhost:3000');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
  })

  test('TC01 Login', async ({ page }) => {
    // await page.goto('http://localhost:3000');
    // await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    // await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    // await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', {name: 'Tester Hotel Overview'})).toBeVisible;

  });
  test('TC02 Dasboard navigation', async ({ page }) => {
    // await page.goto('http://localhost:3000');
    // await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    // await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await expect(page.getByRole('heading', {name: 'Tester Hotel Overview'})).toBeVisible;
    // await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('#app > div > div > div:nth-child(1) > a').click();
    await expect(page).toHaveURL('http://localhost:3000/rooms');
    await expect(page.getByText('Rooms')).toBeVisible;
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