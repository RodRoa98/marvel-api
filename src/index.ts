import app from './App';
import Config from './utils/config';
import * as artifactInfo from '../package.json';
import Logger from './lib/logger';

const config = Config.get();
const logger = Logger.getLogger('app');

(async () => {
  const host = '0.0.0.0';
  const port = +process.env.PORT || config.service.port;

  app.listen(port, host, () => {
    logger.info(`<${artifactInfo.name}> is listening on ${host}:${port}`);
  });
})();
