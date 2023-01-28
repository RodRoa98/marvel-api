import { Request, Response } from 'express';
import Logger from '../../lib/logger';
import { Ok } from '../../helpers/http.helper';
import * as os from 'os';
import * as pkg from '../../../package.json';

const logger = Logger.getLogger('health-controller');

export default class HealthController {
  public async info(req: Request, res: Response): Promise<any> {
    const info = {
      app: {
        version: pkg.version,
        build: process.env.APP_BUILD || 'no-build',
        commit: process.env.APP_COMMIT || 'no-commit',
        name: pkg.name,
        environment: process.env.NODE_ENV,
      },
      hostname: os.hostname(),
    };

    return Ok(res, info);
  }
}
