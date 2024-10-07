import { test, expect } from '@playwright/test';

test.describe('Front-End Tests', () => {

  test.beforeEach(async ({page}) => {

    await page.goto('http://localhost:3000', {waitUntil: 'networkidle'});
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('http://localhost:3000/');
  })

  test('TC01 Login', async ({ page }) => {
    await page.waitForURL('http://localhost:3000/', {waitUntil: 'networkidle'});
    await expect(page.getByRole('heading', {name: 'Tester Hotel Overview'})).toBeVisible;

  });

  test('TC02 Dasboard navigation', async ({ page }) => {
    await page.waitForURL('http://localhost:3000/', {waitUntil: 'networkidle'});
    await page.locator('div').filter({ hasText: /^RoomsNumber: 2View$/ }).getByRole('link').click();
    await expect(page).toHaveURL('http://localhost:3000/rooms');
    await expect(page.getByText('Rooms')).toBeVisible;
  });
  
  test('TC03 New Room navigation', async ({ page }) => {
    await page.waitForURL('http://localhost:3000/', {waitUntil: 'networkidle'});
    await page.locator('div').filter({ hasText: /^RoomsNumber: 2View$/ }).getByRole('link').click();
    await page.getByRole('link', { name: 'Create Room' }).click();
    await expect(page).toHaveURL('http://localhost:3000/room/new');
    await expect(page.getByText('New Room')).toBeVisible;
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