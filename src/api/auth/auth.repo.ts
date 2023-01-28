import Config from '../../utils/config';
import Logger from '../../lib/logger';

import { HTTP_STATUS } from '../../constants/http-status.constant';
import User from '../users/users.model';
import { generateTokens, passwordCompare } from './auth.service';
import { BIT_VALUE } from '../../constants/general.constant';
import { to } from '../../helpers/fetch.helper';
import { verifyToken } from '../../utils/token';

const config = Config.get();
const logger = Logger.getLogger('auth-repo');

export async function authenticate(credentials: {
  email: string;
  password?: string;
}): Promise<{ status: number; data?: { jwtToken: string; refreshToken: string } }> {
  const { email, password } = credentials;

  const [userErr, userRes] = await to(User.findOne({ email }).exec());
  if (userErr) {
    logger.info('[authenticate] error finding user in DB');
    return Promise.reject(userErr);
  }
  if (!userRes) {
    return Promise.resolve({ status: HTTP_STATUS.NOT_FOUND });
  }
  if (!passwordCompare(password, userRes.password)) {
    return Promise.resolve({ status: HTTP_STATUS.UNAUTHORIZED });
  }
  if (userRes.active !== BIT_VALUE.TRUE) {
    return Promise.resolve({ status: HTTP_STATUS.UNAUTHORIZED });
  }

  const [errToken, tokens] = await to(generateTokens({ user: userRes }));
  if (errToken) {
    logger.info('[authenticate] error generating token');
    return Promise.reject(errToken);
  }

  return Promise.resolve({
    status: HTTP_STATUS.OK,
    data: { jwtToken: tokens.jwtToken, refreshToken: tokens.refreshToken },
  });
}

export async function authRefreshToken(refreshToken: string): Promise<{
  status: number;
  message?: string;
  data?: { jwtToken: string; refreshToken: string };
}> {
  const [tokenErr, decoded] = await to(verifyToken(refreshToken, config.service.jwt.refresh_token.encryption));
  if (tokenErr) {
    return Promise.resolve({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: 'Token not valid',
    });
  }

  const [userErr] = await to(User.findOne({ email: decoded.email }).exec());
  if (userErr) {
    logger.info('error finding user');
    return Promise.reject(userErr);
  }

  const [errToken, tokens] = await to(generateTokens({ user: decoded }));
  if (errToken) {
    logger.info('error token generation');
    return Promise.reject(errToken);
  }

  return Promise.resolve({
    status: HTTP_STATUS.OK,
    data: { jwtToken: tokens.jwtToken, refreshToken: tokens.refreshToken },
  });
}
