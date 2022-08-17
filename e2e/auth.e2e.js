const request = require('supertest');
const createApp = require('./../src/app');
const sequelize = require('./../src/db/sequelize');
const { models } = sequelize;
const { upSeed, downSeed } = require('./utils/umzug');

const mockSendMail = jest.fn()

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: mockSendMail,
  })),
}))

describe('Testing for /auth endpoints', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(8000);
    api = request(app);
    await upSeed();
  })

  describe('POST /login', () => {

    test('should return 401', async() => {
      const inputData = {
        email: "test@gmail.com",
        password: 'dsfhsdfsdfhsdfkh'
      }
      const { statusCode } = await api.post('/api/v1/auth/login').send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 200', async() => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: 'admin123'
      }
      const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData);
      expect(statusCode).toEqual(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.email).toEqual(user.email);
      expect(body.user.password).toBeUndefined();
    });

  });

  describe('POST /recovery', () => {

    beforeEach( () => {
      mockSendMail.mockClear();
    });

    test('should return 200', async() => {
      const inputData = {
        email: "admin@mail.com",
      }
      mockSendMail.mockResolvedValue(true);
      const { statusCode, body } = await api.post('/api/v1/auth/recovery').send(inputData);
      expect(statusCode).toEqual(200);
      expect(body.message).toEqual('mail sent');
      expect(mockSendMail).toHaveBeenCalled();
      // check DB
      const user = await models.User.findOne({ where: { email: inputData.email } });
      expect(user.recoveryToken).toBeTruthy();
    });

  });

  afterAll(async () => {
    await downSeed();
    server.close();
  })
});
