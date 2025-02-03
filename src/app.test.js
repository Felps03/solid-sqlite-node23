import test from 'node:test';
import assert from 'node:assert';
import { startServer } from './app.js';

const BASE_URL = 'http://localhost:3001';

test('GET /users returns status 200 and an array', async () => {
  const server = await startServer(3001);
  try {
    const response = await fetch(`${BASE_URL}/users`);
    assert.strictEqual(response.status, 200, 'Status should be 200');
    const data = await response.json();
    assert.ok(Array.isArray(data), 'Response should be an array');
  } finally {
    server.close();
  }
});

test('POST /users creates a user', async () => {
  const server = await startServer(3001);
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'testuser@example.com' })
    });
    assert.strictEqual(response.status, 201, 'Status should be 201');
    const user = await response.json();
    assert.strictEqual(user.name, 'Test User');
    assert.strictEqual(user.email, 'testuser@example.com');
    assert.ok(user.id, 'User should have an id');
  } finally {
    server.close();
  }
});

test('PUT /users/:id updates a user', async () => {
  const server = await startServer(3001);
  try {
    const createResponse = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Update User', email: 'updateuser@example.com' })
    });
    const createdUser = await createResponse.json();
    
    const updateResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated User', email: 'updated@example.com' })
    });
    assert.strictEqual(updateResponse.status, 200, 'Status should be 200');
    const updatedUser = await updateResponse.json();
    assert.strictEqual(updatedUser.name, 'Updated User');
    assert.strictEqual(updatedUser.email, 'updated@example.com');
  } finally {
    server.close();
  }
});

test('DELETE /users/:id deletes a user', async () => {
  const server = await startServer(3001);
  try {

    const createResponse = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Delete User', email: 'deleteuser@example.com' })
    });

    const createdUser = await createResponse.json();
    const deleteResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`, {
      method: 'DELETE'
    });

    assert.strictEqual(deleteResponse.status, 200, 'Status should be 200');
    const result = await deleteResponse.json();
    assert.strictEqual(result.message, 'User removed.');

    const getResponse = await fetch(`${BASE_URL}/users/${createdUser.id}`);
    assert.strictEqual(getResponse.status, 404, 'Status should be 404 after deletion');
  } finally {
    server.close();
  }
});
