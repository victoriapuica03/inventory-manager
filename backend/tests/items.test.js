const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../app');

const DATA_FILE = path.join(__dirname, '../data/items.json');
let initialData = '';

beforeAll(async () => {
  initialData = await fs.readFile(DATA_FILE, 'utf8');
});

afterAll(async () => {
  await fs.writeFile(DATA_FILE, initialData, 'utf8');
});

describe('API Inventar - /api/items', () => {
  let createdItemId;

  test('1. GET /api/items -> returnează 200 și lista de obiecte', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('2. POST /api/items valid -> returnează 201 și adaugă obiectul', async () => {
    const newItem = {
      name: 'Monitor Dell Test',
      serialNumber: 'TEST-SN-999',
      value: 1200,
      category: 'Periferice',
      purchaseDate: '2026-11-18'
    };

    const res = await request(app).post('/api/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Monitor Dell Test');
    createdItemId = res.body.id;
  });

  test('3. POST /api/items invalid -> returnează 400', async () => {
    const invalidItem = {
      name: '',
      serialNumber: 'TEST-ERR',
      value: -50,
      category: 'Test',
      purchaseDate: '2026-11-18'
    };

    const res = await request(app).post('/api/items').send(invalidItem);
    expect(res.statusCode).toBe(400);
  });

  test('4. POST /api/items cu serial duplicat -> returnează 409', async () => {
    const duplicateItem = {
      name: 'Alt Monitor',
      serialNumber: 'TEST-SN-999',
      value: 900,
      category: 'Periferice',
      purchaseDate: '2026-11-18'
    };

    const res = await request(app).post('/api/items').send(duplicateItem);
    expect(res.statusCode).toBe(409);
  });

  test('5. PUT /api/items/:id -> returnează 200 și actualizează obiectul', async () => {
    const updatedData = {
      name: 'Monitor Dell Actualizat',
      serialNumber: 'TEST-SN-999',
      value: 1350,
      category: 'Periferice',
      purchaseDate: '2026-11-18'
    };

    const res = await request(app).put(`/api/items/${createdItemId}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Monitor Dell Actualizat');
    expect(res.body.value).toBe(1350);
  });

  test('6. DELETE /api/items/:id -> returnează 204 și șterge obiectul', async () => {
    const res = await request(app).delete(`/api/items/${createdItemId}`);
    expect(res.statusCode).toBe(204);
  });

  test('7. Operație pe element inexistent -> returnează 404', async () => {
    const res = await request(app).delete('/api/items/999999');
    expect(res.statusCode).toBe(404);
  });
});
