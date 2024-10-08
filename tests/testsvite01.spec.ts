import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { BASE_URL } from './testTarget.ts';


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
  let apiHelper: APIHelper;

  test.beforeAll(async ({ request }) => {
    apiHelper = new APIHelper(BASE_URL, `${process.env.TEST_USERNAME}`, `${process.env.TEST_PASSWORD}`);
    console.log(`${process.env.TEST_PASSWORD}`)
    const loginResponse = await apiHelper.performLogin(request);
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty('username', `${process.env.TEST_USERNAME}`);
    expect(loginData).toHaveProperty('token');

  })
  
  test('TC01 Login', async ({ request }) => {
    const loginResponse = await apiHelper.performLogin(request);
    const loginData = await loginResponse.json();
    expect(loginResponse.ok()).toBeTruthy();
    expect(loginData).toMatchObject({
      username: `${process.env.TEST_USERNAME}`,
      token: expect.any(String),
    });

  });

  test('Test case 02, Get all rooms', async ({ request }) => {
    const roomsResponse = await apiHelper.getAllRooms(request);
    expect(roomsResponse.ok()).toBeTruthy();
    const roomsData = await roomsResponse.json();
    expect(roomsData.length).toBeGreaterThan(0);
    expect(roomsData[0]).toMatchObject({
      "id": 1,
      "created": "2020-01-03T12:00:00.000Z",
      "category": "double",
      "floor": 1,
      "number": 101,
      "available": true,
      "price": 1500,
      "features": [
        "balcony",
        "ensuite"
      ]
    });
  })

  test('Test case 03 - Delete room', async ({ request }) => {
    const getAllRooms = await apiHelper.getAllRooms(request);
    expect(getAllRooms.ok()).toBeTruthy();
    const getRoom = await getAllRooms.json();
    const lastButOneID = getRoom[getRoom.length - 1].id;
    const deleteRequest = await apiHelper.deleteRoom(request, lastButOneID);
    expect(deleteRequest.ok()).toBeTruthy();
  });
 
  });