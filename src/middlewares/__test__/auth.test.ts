import AuthService from "@src/services/auth";
import { authMiddleware } from "../auth";

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next function', () => {
    const token = AuthService.generateToken({ date: 'fake' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {};
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const req = {
      headers: {
        authorization: `mal formed token`
      }
    };
    const send = jest.fn();
    const res = {
      status: jest.fn(() => ({ send }))
    };

    const next = jest.fn();
    authMiddleware(req, res as object, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalledWith({
      message: 'invalid token'
    });
  });

  it('should return UNAUTHORIZED if Authorization header is empty', () => {
    const req = {
      headers: { }
    };
    const send = jest.fn();
    const res = {
      status: jest.fn(() => ({ send }))
    };

    const next = jest.fn();
    authMiddleware(req as object, res as object, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalledWith({
      message: 'invalid token'
    });
  });
});