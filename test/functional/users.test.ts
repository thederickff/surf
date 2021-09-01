import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { CustomGlobal } from '../globals';
declare const global: CustomGlobal;

describe('users functional test', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  const user = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456'
  };

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const response = await global.testRequest.post('/users').send(user);

      expect(response.status).toBe(201);
      await expect(AuthService.comparePasswords(user.password, response.body.password)).resolves.toBeTruthy();
      expect(response.body).toEqual(expect.objectContaining({ ... user, ... { password: expect.any(String) } }));
    });

    it('should return 422 when there is a validation error', async () => {
      const user = {
        email: 'john@mail.com',
        password: '123456'
      };

      const response = await global.testRequest.post('/users').send({
        email: user.email,
        password: user.password
      });

      expect(response.status).toBe(422);
    });

    it('should return an error for duplicated email in the database', async () => {
      await global.testRequest.post('/users').send(user);
      const response = await global.testRequest.post('/users').send(user);
      expect(response.body).toEqual({
        errors: ['Path `email` already exists in the database.']
      });
    });

    it('should return three errors, name required, password required, and email duplicated', async () => {
      await global.testRequest.post('/users').send(user);
      const response = await global.testRequest.post('/users').send({
        email: user.email
      });

      expect(response.body).toEqual({
        errors: [
          'Path `password` is required.',
          'Path `name` is required.',
          'Path `email` already exists in the database.'
        ]
      });
    });
  })

  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      await new User(user).save();
      const response = await global.testRequest.post('/users/authenticate').send({
        email: user.email,
        password: user.password
      });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('should return UNAUTHORIZED if an user with the given email is not found', async () => {
      const response = await global.testRequest.post('/users/authenticate').send({
        email: user.email,
        password: user.password
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'user not found' });
    });

    it('should return UNAUTHORIZED if an user is found but the password does not match', async () => {
      await new User(user).save();
      const response = await global.testRequest.post('/users/authenticate').send({
        email: user.email,
        password: 'other-password'
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'the password does not match' });
    });
  })
})