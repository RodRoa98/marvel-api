import { Request, Response } from 'express';

import Logger from '../../lib/logger';
import { to } from '../../helpers/fetch.helper';
import { Ok } from '../../helpers/http.helper';
import { throwExternalError } from '../../helpers/error.helper';
import MarvelAPI from '../../services/marvel';
import { parseMarvelRes } from './marvel.map';

const logger = Logger.getLogger('marvel-controller');

export default class MarvelController {
  public async findCharacters(req: Request, res: Response) {
    const [marvelErr, marvelRes] = await to(MarvelAPI.getCharacters());
    if (marvelErr) {
      logger.info(marvelErr);
      throwExternalError(marvelErr);
    }

    return Ok(res, parseMarvelRes(marvelRes));
  }
}
