import { Request, Response } from 'express';

import Logger from '../../lib/logger';

import { to } from '../../helpers/fetch.helper';
import { NotAuth, NotFound, Ok } from '../../helpers/http.helper';
import { authenticate, authRefreshToken } from './auth.repo';
import { HTTP_STATUS } from '../../constants/http-status.constant';
import { throwDBError } from '../../helpers/error.helper';
import { JWT } from '../../constants/token.constant';
import { setAuthCookies } from './auth.service';

const logger = Logger.getLogger('auth-controller');

export default class UserController {
  public authenticate = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const [authErr, authResult] = await to(authenticate({ email, password }));
    const { status, data } = authResult || {};
    if (authErr) {
      return throwDBError(authErr);
    }

    switch (status) {
      case HTTP_STATUS.NOT_FOUND:
        return NotFound(res, { message: 'User not found' });
      case HTTP_STATUS.UNAUTHORIZED:
        return NotAuth(res, { message: 'User not authorized' });
      default:
        const { jwtToken, refreshToken } = data;
        setAuthCookies(res, jwtToken, refreshToken);

        return Ok(res, { jwtToken, refreshToken });
    }
  };

  public refresh = async (req, res: Response): Promise<any> => {
    const refreshToken = req.body.refreshToken || (req.cookies && req.cookies[JWT.NAME]);
    if (!refreshToken) {
      return NotAuth(res, { message: 'No token found' });
    }

    const [refreshTokenErr, refreshTokenRes] = await to(authRefreshToken(refreshToken));
    if (refreshTokenErr) {
      throwDBError(refreshTokenErr);
    }

    const { status, data, message } = refreshTokenRes;
    switch (status) {
      case HTTP_STATUS.NOT_FOUND:
        return NotFound(res, { message });
      case HTTP_STATUS.UNAUTHORIZED:
        return NotAuth(res, { message });
      default:
        const { jwtToken, refreshToken: newRefreshToken } = data;
        setAuthCookies(res, jwtToken, newRefreshToken);

        return Ok(res, { jwtToken, refreshToken: newRefreshToken });
    }
  };
}
