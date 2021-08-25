import { User } from '@src/models/user';
import { CustomGlobal } from '../globals';
declare const global: CustomGlobal;

describe('users functional test', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  })

  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456'
      };

      const response = await global.testRequest.post('/users').send(user);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(user));
    });

    it('should return 422 when there is a validation error', async () => {
      const user = {
        email: 'john@mail.com',
        password: '123456'
      };

      const response = await global.testRequest.post('/users').send(user);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'User validation failed: name: Path `name` is required.'
      });
    });

    it.skip('should return 500 when there is any error other than validation error', async () => {
    })
  })
})