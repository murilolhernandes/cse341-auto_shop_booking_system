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

describe('Cars GET endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /car returns 200 and an array', async () => {
    mockToArray.mockResolvedValueOnce([{ firstName: 'Test' }]);

    const res = await request(app).get('/car');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /car returns 500 if DB throws', async () => {
    mockToArray.mockRejectedValueOnce(new Error('DB fail'));

    const res = await request(app).get('/car');

    expect(res.status).toBe(500);
  });
});
