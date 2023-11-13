//const { test } = require('@playwright/test');
import { test, request, expect } from '@playwright/test';
const Ajv = require('ajv');

test.describe.serial('Schema validation Tests', () => {
test('highlevel test to check JSON schema against the GET response', async ({ request }) => {
    // Initialize AJV
    const ajv = new Ajv();

    // Load the schema (assuming it's located at './fixtures/schema.json')
    const schema = require('../response-schema.json');

    // Perform the API request using Playwright
    const response = await request.get('https://gorest.co.in/public/v1/users');
    const responseData = await response.json();
    console.log(responseData);

    // Validate the response against the schema
    const valid = ajv.validate(schema, responseData);

    // If the validation is not valid, log the detailed errors.
    if (!valid) {
        console.error('AJV Validation Errors:', ajv.errorsText());
    }

    expect(valid).toBe(true)
});

test('validating the response timestamp value against the current execution timestamp value', async ({ request }) => {

    // Initialize AJV
    const ajv = new Ajv();

    // Load the schema (assuming it's located at './fixtures/schema.json')
    const schema = require('../response-schema2.json');

    // Fetch the API data directly in Playwright
    const response = await request.get('https://mempool.space/api/tx/15e10745f15593a899cef391191bdd3d7c12412cc4696b7bcb669d0feadc8521/status');
    const data = await response.json();
    console.log(data)

    const blockTime = data.block_time;  // block_time from API
    const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds

    expect(currentTime - blockTime).not.toBeLessThanOrEqual(5);
});

})