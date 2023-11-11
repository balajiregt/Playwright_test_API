import { test, expect } from '@playwright/test';
import { request } from 'http';
const fs = require('fs');

test.describe('mock requests', () => {

  test('log the network apis', async ({ page }) => {

    // Intercept network requests
    await page.route(/.*\/api\/.*/, async (route, request) => {
      console.log('Request URL:', request.url());
      await route.continue();
    });
    await page.goto('https://demo.realworld.io/#/');

  })

  test('intercept and modify network request header', async ({ page }) => {
    // Intercept network requests and modify headers
    await page.route('https://httpbin.org/headers', (route, request) => {
      // Get original headers
      const originalHeaders = request.headers();
      //console.log('original headers:', originalHeaders);

      // Modify the Accept-Language header
      const modifiedHeaders = { ...originalHeaders };
      modifiedHeaders['accept-language'] = 'en-US';
      console.log('Modified headers:', modifiedHeaders);

      // Continue the request with modified headers
      route.continue({
        headers: modifiedHeaders,
      });
    });

    // Listen for the 'requestfinished' event on the page
    page.on('requestfinished', async (request) => {
      // Check if the request URL includes 'https://httpbin.org/headers'
      if (request.url().includes('https://httpbin.org/headers')) {
        // Retrieve the request headers
        const requestHeaders = request.headers();

        // Assert that the 'Accept-Language' header is present in the request headers
        // with the expected value 'en-US'
        expect(requestHeaders).toHaveProperty('accept-language', 'en-US');
      }
    });


    // Navigate to a web page that triggers a network request to the intercepted URL
    await page.goto('https://httpbin.org/headers');
  });



  test('intercept and delete request header', async ({ page }) => {
    // Intercept network requests
    await page.route('https://httpbin.org/headers', (route, request) => {
      // Get original request headers
      const originalHeaders = request.headers();
      //console.log('original headers:', originalHeaders);

      // Remove a specific header (e.g., 'user-agent')
      delete originalHeaders['accept-language'];
      console.log('headers after deleting:', originalHeaders)

      // Continue the request with the modified headers
      route.continue({
        headers: originalHeaders,
      });
    });

    // Listen for the 'requestfinished' event on the page
    page.on('requestfinished', async (request) => {
      // Check if the request URL includes 'https://httpbin.org/headers'
      if (request.url().includes('https://httpbin.org/headers')) {
        // Retrieve the request headers and store them in requestHeaders
        const requestHeaders = await request.headers();

        // Assert that the 'Accept-Language' header is not present in the request headers
        expect(requestHeaders).not.toHaveProperty('accept-language')
      }
    });


    // Navigate to the desired page and perform actions
    await page.goto('https://httpbin.org/headers');
    // ... Perform other actions or tests

  })


  test('abort requests with matching file types/', async ({ page }) => {
    // Intercept network requests
    await page.route('**/*', (route) => {
      const request = route.request();
      const url = request.url();

      // Check if the request URL matches image types
      if (url.match(/\.(png|jpg|jpeg|svg)$/i)) {
        console.log(`Aborting request for ${url}`);
        route.abort(); // Abort the request if the URL matches image types
        console.log(`Request aborted for ${url}`);
      } else {
        route.continue();
      }
    });

    // Visit a website that triggers a network call to the intercepted URL
    await page.goto('https://dog.ceo', { timeout: 60000 }); // Increase the timeout, e.g., to 60 seconds

    // Add any other test assertions here
  });


});


test('intercept, modify response data and trigger a GET call', async ({ page }) => {
  function readJsonFile(filePath) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  const newData = readJsonFile('/Users/bky13/Desktop/my_projects/Playwright_Practice-master/Playwright_practice_project1/tests/Sanity_testing/testdata1.json');

  const urlToIntercept = 'https://api.openweathermap.org/data/2.5/forecast?q=London,%20GB&APPID=c83b50aff9a68abefa34e64895024d99&units=metric';

  await page.route(urlToIntercept, async (route) => {
    console.log('Intercepted request:', route.request().url());

    // Replace the response with the modified data
    route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
  });
  await page.goto('https://weather-forecast-demo-app.vercel.app/');
  await page.locator('path').click()
  // Wait for the request to be intercepted and the new response to be loaded
  await page.waitForResponse(urlToIntercept);

  // Additional test steps, if needed
  // ...
  expect(await page.locator('.pagination')).not.toBeVisible()
  // Take a screenshot
  await page.screenshot();
})