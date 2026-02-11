const request = require('supertest');

jest.mock('../config/passport', () => () => {});

jest.mock('connect-mongo', () => ({
  default: {
    create: () => ({
      on: () => {}
    })
  }
}));

jest.mock('../utilities/authenticate', () => ({
  login: (req, res, next) => next(),
  isAuthenticated: (req, res, next) => next()
}));

const mockToArray = jest.fn();
const mockFind = jest.fn(() => ({ toArray: mockToArray }));
const mockCollection = jest.fn(() => ({ find: mockFind }));
const mockDb = jest.fn(() => ({ collection: mockCollection }));
const mockGetDb = jest.fn(() => ({ db: mockDb }));

jest.mock('../db/connect', () => ({
  getDb: () => mockGetDb()
}));

const app = require('../app');

describe('Client GET endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /client returns 200 and array', async () => {
    mockToArray.mockResolvedValueOnce([{ firstName: 'ClientTest' }]);

    const res = await request(app).get('/client');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /client returns 500 if DB fails', async () => {
    mockToArray.mockRejectedValueOnce(new Error('DB fail'));

    const res = await request(app).get('/client');

    expect(res.status).toBe(500);
  });

  test('GET /client/:id returns 404 when not found', async () => {
    mockToArray.mockResolvedValueOnce([]);

    const res = await request(app).get('/client/507f1f77bcf86cd799439011');

    expect(res.status).toBe(404);
  });

  test('GET /client/:id returns 400 for invalid id', async () => {
    const res = await request(app).get('/client/not-valid-id');

    expect(res.status).toBe(400);
  });
});
