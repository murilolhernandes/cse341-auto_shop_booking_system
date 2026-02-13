const request = require('supertest');

jest.mock('../config/passport', () => () => {});

jest.mock('connect-mongo', () => ({
  default: {
    create: () => ({
      on: () => {},
    }),
  },
}));

jest.mock('../utilities/authenticate', () => ({
  login: (req, res, next) => next(),
  isAuthenticated: (req, res, next) => next(),
}));

const mockToArray = jest.fn();
const mockFind = jest.fn(() => ({ toArray: mockToArray }));
const mockCollection = jest.fn(() => ({ find: mockFind }));
const mockDb = jest.fn(() => ({ collection: mockCollection }));
const mockGetDb = jest.fn(() => ({ db: mockDb }));

jest.mock('../db/connect', () => ({
  getDb: () => mockGetDb(),
}));

const { createApp } = require('../server');
const app = createApp();

describe('Clients GET /client/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /client/:id returns 400 for invalid id', async () => {
    const res = await request(app).get('/client/not-a-valid-objectid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('GET /client/:id returns 404 when user not found', async () => {
    mockToArray.mockResolvedValueOnce([]);

    const res = await request(app).get('/client/698f70cf0432ef2b7738f490');

    expect(res.status).toBe(404);
    expect(res.body).toBe('Record not found');
  });
});
