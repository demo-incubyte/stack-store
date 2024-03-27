const request = require('supertest');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./db'); // Assuming there is a db module to import

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock database and User model
const User = {
  findById: jest.fn((id) => Promise.resolve({ id, sanitize: () => ({ id }) })),
};
db.model = jest.fn((modelName) => {
  if (modelName === 'user') return User;
  return null;
});

// Mock SequelizeStore
const dbStore = new SequelizeStore({ db: db });
dbStore.sync = jest.fn();

// Mock app.getValue for SESSION_SECRET
app.getValue = jest.fn((key) => {
  if (key === 'env') return { SESSION_SECRET: 'test_secret' };
  return null;
});

// Mock passport strategies
jest.mock('path', () => ({
  join: () => 'mockStrategy',
}));
jest.mock('mockStrategy', () => (app, db) => {}, { virtual: true });

// Include the user's code to setup passport and session
require('./userCode')(app, db); // Assuming the user's code is in a file named userCode.js

describe('Session Middleware Security', () => {
  it('should not use the default session cookie name', (done) => {
    request(app)
      .get('/session')
      .expect((res) => {
        if (res.headers['set-cookie']) {
          res.headers['set-cookie'].forEach((cookie) => {
            expect(cookie).not.toMatch(/^connect\.sid=/);
          });
        }
      })
      .end(done);
  });
});