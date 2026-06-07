import test, { before, after } from 'node:test';
import assert from 'node:assert';
import { startServer } from './app.js';

const BASE_URL = 'http://localhost:3001';

let server;

before(async () => {
  server = await startServer(3001);
});

after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test('GET /users returns status 200 and an array', async () => {
  // Given: the API is running and there may be users registered

  // When: a client requests the list of users
  const response = await fetch(`${BASE_URL}/users`);
  const data = await response.json();

  // Then: it responds with 200 and an array
  assert.strictEqual(response.status, 200, 'Status should be 200');
  assert.ok(Array.isArray(data), 'Response should be an array');
});

test('POST /users creates a user', async () => {
  // Given: a valid user payload
  const payload = { name: 'Test User', email: 'testuser@example.com' };

  // When: the client creates a new user
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const user = await response.json();

  // Then: the user is created and returned with an id
  assert.strictEqual(response.status, 201, 'Status should be 201');
  assert.strictEqual(user.name, payload.name);
  assert.strictEqual(user.email, payload.email);
  assert.ok(user.id, 'User should have an id');
});

test('PUT /users/:id updates a user', async () => {
  // Given: an existing user
  const createResponse = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Update User', email: 'updateuser@example.com' })
  });
  const createdUser = await createResponse.json();

  // When: the client updates that user's data
  const updateResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Updated User', email: 'updated@example.com' })
  });
  const updatedUser = await updateResponse.json();

  // Then: the updated data is persisted and returned
  assert.strictEqual(updateResponse.status, 200, 'Status should be 200');
  assert.strictEqual(updatedUser.name, 'Updated User');
  assert.strictEqual(updatedUser.email, 'updated@example.com');
});

test('PUT /users/:id returns 404 for a non-existent user', async () => {
  // Given: a user id that does not exist
  const nonExistentId = 999999;

  // When: the client tries to update that user
  const response = await fetch(`${BASE_URL}/users/${nonExistentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Ghost', email: 'ghost@example.com' })
  });

  // Then: the API responds with 404
  assert.strictEqual(response.status, 404, 'Status should be 404');
});

test('POST /users returns 400 for invalid input', async () => {
  // Given: a payload with an empty name and an invalid email
  const invalidPayload = { name: '', email: 'not-an-email' };

  // When: the client tries to create a user with that payload
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload)
  });

  // Then: the API responds with 400
  assert.strictEqual(response.status, 400, 'Status should be 400');
});

test('DELETE /users/:id deletes a user', async () => {
  // Given: an existing user
  const createResponse = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Delete User', email: 'deleteuser@example.com' })
  });
  const createdUser = await createResponse.json();

  // When: the client deletes that user
  const deleteResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`, {
    method: 'DELETE'
  });
  const result = await deleteResponse.json();

  // Then: the user is removed and can no longer be found
  assert.strictEqual(deleteResponse.status, 200, 'Status should be 200');
  assert.strictEqual(result.message, 'User removed.');

  const getResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`);
  assert.strictEqual(getResponse.status, 404, 'Status should be 404 after deletion');
});
