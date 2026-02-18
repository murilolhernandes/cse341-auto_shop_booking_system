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
  loginGH: (req, res, next) => next(),
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

describe('Users GET /user/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /user/:id returns 400 for invalid id', async () => {
    const res = await request(app).get('/user/not-a-valid-objectid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('GET /user/:id returns 404 when user not found', async () => {
    mockToArray.mockResolvedValueOnce([]);

    const res = await request(app).get('/user/698f6f8e26ad235e19a2f8a8');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
