import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import Logger, { ILogger } from './lib/logger';
import * as morgan from 'morgan';

import Config from './utils/config';
import { IDefault } from './utils/config-interfaces';
import { initDatabases } from './database';
import * as errorHandler from './helpers/error.helper';

class App {
  public express: express.Application;
  private config: IDefault;
  private logger: ILogger;

  constructor() {
    this.express = express();
    this.config = Config.get();
    this.logger = Logger.getLogger('app');

    this.initDatabase();
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private initDatabase(): void {
    initDatabases();
  }

  private setMiddlewares(): void {
    this.logger.info('Loading middlewares...');
    const stream = {
      write: (message) => this.logger.http(message),
    };
    const skip = () => {
      const env = process.env.NODE_ENV || 'local';
      return env !== 'local';
    };
    const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream,
      skip,
    });

    this.express.use(morganMiddleware);
    // Cross-origin
    this.express.use((req: express.Request, res: express.Response, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization'
      );
      next();
    });
    this.express.use(cors({ credentials: true, origin: false }));
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    this.express.use(helmet());
    this.logger.info('Middlewares loaded');
  }

  private setRoutes(): void {
    this.logger.info('Loading api routes...');
    // Set your routes
    const api = require('./api');
    this.express.use('/api', api.default);
    this.logger.info('Api routes loaded...');
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.errorHandler);
  }
}

const app = new App();

export default app.express;
