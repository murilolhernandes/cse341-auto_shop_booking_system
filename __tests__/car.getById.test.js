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

describe('Cars GET /car/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /car/:id returns 400 for invalid id', async () => {
    const res = await request(app).get('/car/not-a-valid-objectid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /car/:id returns 404 when user not found', async () => {
    mockToArray.mockResolvedValueOnce([]);

    const res = await request(app).get('/car/698f71f3e75042ca5a51b4ff');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
