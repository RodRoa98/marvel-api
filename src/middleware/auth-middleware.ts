import { Request, Response } from 'express';
import * as jwtLib from 'jwt-then';
import { JWT } from '../constants/token.constant';
import { to } from '../helpers/fetch.helper';

export const authenticate = ({ logger, config }) => {
  return async (req: Request, res: Response, next) => {
    const token: string = req.headers.authorization?.split(' ')[1] || (req.cookies && req.cookies[JWT.NAME]);
    if (!token) {
      logger.info('Token not founded in headers nor cookies');
      return res.status(401).send({ message: 'No token provided.', url: req.url, jwtErr: true });
    }

    const [jwtErr, jwtDecoded] = await to(jwtLib.verify(token, config.service.jwt.encryption));
    if (jwtErr) {
      logger.info(`Error al verificar el token: ${JSON.stringify(jwtErr, null, 2)}`);
      return res.status(401).send({ message: 'Invalid token provided.', url: req.url, jwtErr: true });
    }

    decorateReqObject(req, token, jwtDecoded);
    next();
  };
};

function decorateReqObject(req, token, jwtDecoded): void {
  req.userId = jwtDecoded.id;
  req.email = jwtDecoded.email;
  req.token = token;
}
