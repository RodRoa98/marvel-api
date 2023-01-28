import * as cryptojs from 'crypto-js';
import { JWT } from '../../constants/token.constant';
import { coerceBooleanProp, setDateOneMonthLater } from '../../utils';
import Config from '../../utils/config';
import { generateToken } from '../../utils/token';

const config = Config.get();

export const passwordEncrypt = (password: string): string => {
  return cryptojs.MD5(`${password}${config.service.auth.salt}`).toString();
};

export const passwordCompare = (password: string, passwordUser: string): boolean => {
  return passwordUser === passwordEncrypt(password);
};

export function setAuthCookies(res, jwtToken, refreshToken): void {
  res.cookie(JWT.NAME, jwtToken, {
    httpOnly: coerceBooleanProp(config.metadata.cookie.httpOnly),
    ...(config.metadata.cookie.sameSite ? { sameSite: config.metadata.cookie.sameSite } : {}),
    secure: config.metadata.cookie.sameSite,
    domain: config.metadata.cookie.domain,
    expires: setDateOneMonthLater(),
  });
  res.cookie(JWT.REFRESH, refreshToken, {
    httpOnly: coerceBooleanProp(config.metadata.cookie.httpOnly),
    path: `${config.service.basePath}/v1/auth/refresh`,
    ...(config.metadata.cookie.sameSite ? { sameSite: config.metadata.cookie.sameSite } : {}),
    secure: config.metadata.cookie.sameSite,
    domain: config.metadata.cookie.domain,
    expires: setDateOneMonthLater(),
  });
}

export const generateTokens = async ({ user }) => {
  const claims = {
    id: user.id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
  };

  return {
    jwtToken: await generateToken(claims, config.service.jwt.expiration, config.service.jwt.encryption),
    refreshToken: await generateToken(
      claims,
      config.service.jwt.refresh_token.expiration,
      config.service.jwt.refresh_token.encryption
    ),
  };
};
