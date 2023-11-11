require('dotenv').config();
const { request } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;

async function createRequestContext() {
  return request.newContext({
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.GOREST_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

async function getRequest(endpoint) {
  const context = await createRequestContext();
  return context.get(`${BASE_URL}${endpoint}`);
}

async function postRequest(endpoint, body) {
  const context = await createRequestContext();
  return context.post(`${BASE_URL}${endpoint}`, { data: body });
}

async function putRequest(endpoint, body) {
  const context = await createRequestContext();
  return context.put(`${BASE_URL}${endpoint}`, { data: body });
}

async function deleteRequest(endpoint) {
  const context = await createRequestContext();
  return context.delete(`${BASE_URL}${endpoint}`);
}

module.exports = { getRequest, postRequest, putRequest, deleteRequest };
