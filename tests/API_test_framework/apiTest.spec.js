const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const userSchema = require('./userSchema.json')
const { getRequest, postRequest, putRequest, deleteRequest } = require('./requestUtility');
const { saveData, getData } = require('./dataStore');
const fs = require('fs').promises;

test.describe.serial('User API Tests', () => {
    test('POST User', async () => {
        // Read the JSON file
        const newUser = JSON.parse(await fs.readFile('tests/API_test_framework/userData.json', 'utf8'));
        const response = await postRequest('/users', newUser);

        expect(response.status()).toBe(201);
        const responseJson = await response.json();
        saveData('userId', responseJson.id); // Save the user ID for later use
        console.log('New users details', responseJson)
        console.log('New user id', responseJson.id)
    });

    test('GET User - Validate JSON Schema', async () => {
        const userId = getData('userId');
        const response = await getRequest(`/users/${userId}`);

        expect(response.status()).toBe(200);
        const userDetails = await response.json();
        console.log('Retrieved user details', userDetails)

        // Initialize AJV and validate the response
        const ajv = new Ajv();
        const validate = ajv.compile(userSchema);
        const valid = validate(userDetails);

        if (!valid) {
            console.error('AJV Validation Errors:', ajv.errorsText(validate.errors));
        }
        console.log('Schema validation is true')

        expect(valid).toBe(true);
    });

    test('PUT User', async () => {
        const userId = getData('userId');
        const updatedUser = JSON.parse(await fs.readFile('tests/API_test_framework/updateUser.json', 'utf8'));
        const response = await putRequest(`/users/${userId}`, updatedUser);

        expect(response.status()).toBe(200);
        const userDetails = await response.json();
        console.log('Retrieved user details', userDetails)
    });

    test('DELETE User', async () => {
        const userId = getData('userId');
        const response = await deleteRequest(`/users/${userId}`);

        expect(response.status()).toBe(204);
        const responseBody = await response.text();
        expect(responseBody).toBe('');
        console.log(responseBody)
    });

});