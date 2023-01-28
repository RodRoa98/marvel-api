import Logger from '../lib/logger';
import Config from '../utils/config';
import initMongoDB from './mongodb';

const config = Config.get();
const logger = Logger.getLogger('database');

export const initDatabases = () => {
  logger.info('Connecting databases... ');

  Object.keys(config.service.databases).forEach((database) => {
    const dialect = config.service.databases[database].dialect;
    switch (dialect) {
      case 'mongodb':
        logger.info(`[${dialect}] init connection to <${database}>`);
        initMongoDB(database);
        break;
      default:
        break;
    }
  });
};
