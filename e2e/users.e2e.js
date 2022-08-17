const request = require('supertest');
const createApp = require('./../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Testing for /users endpoints', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(8000);
    api = request(app);
    await upSeed();
  })

  describe('POST /users', () => {

    test('should return 400 Bad request with password invalid', async() => {
      const inputData = {
        email: "test@gmail.com",
        password: '123'
      }
      const { headers, statusCode, body } = await api.post('/api/v1/users').send(inputData);
      expect(headers["content-type"]).toMatch(/json/);
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return 400 Bad request with email invalid', async() => {
      const inputData = {
        email: "-----",
        password: 'nico1212asa'
      }
      const { headers, statusCode, body } = await api.post('/api/v1/users').send(inputData);
      expect(headers["content-type"]).toMatch(/json/);
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/email/);
    });

    // TODO: Test to create user successful
    test('should return 201', async() => {
      const inputData = {
        email: "newuser@mail.com",
        password: 'nico1212asa'
      }
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      expect(statusCode).toEqual(201);
      expect(body.password).toBeUndefined();
      expect(body.email).toBe(body.email);
      expect(body.role).toBe('admin');
      // check DB
      const user = await models.User.findByPk(body.id);
      expect(user).toBeTruthy();
      expect(inputData.email).toBe(user.email);
    });

  });

  describe('GET /users/{id}', () => {

    test('should return a user', async () => {
      const user = await models.User.findByPk('1');
      const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`);
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toEqual(user.email);
    });

    test('should return 404 user not found', async () => {
      const inputId = '99999';
      const { statusCode } = await api.get(`/api/v1/users/${inputId}`);
      expect(statusCode).toEqual(404);
    });

  });

  afterAll(async () => {
    await downSeed();
    server.close();
  })
});
