import * as mongoose from 'mongoose';
import * as mongooseSequence from 'mongoose-sequence';
import Logger from '../lib/logger';

import Config from '../utils/config';

export const AutoIncrement = mongooseSequence(mongoose);

const config = Config.get();
const logger = Logger.getLogger('mongodb');

mongoose.set('strictQuery', false);

const databaseEvents = (dbConnectionName: string) => {
  mongoose.connection.on('error', (error: any) => {
    logger.error(`<${dbConnectionName}> connection error: ${error}`);
  });
  mongoose.connection.on('disconnected', () => {
    logger.error(`<${dbConnectionName}> connection lost`);
  });
  mongoose.connection.on('connecting', () => {
    logger.info(`Connecting to <${dbConnectionName}>`);
  });
  mongoose.connection.on('open', () => {
    logger.info(`<${dbConnectionName}> connected`);
  });
};

export default async (dbConnectionName: string) => {
  try {
    databaseEvents(dbConnectionName);

    await mongoose.connect(config.service.databases[dbConnectionName].host, {
      user: config.service.databases[dbConnectionName].user,
      pass: config.service.databases[dbConnectionName].password,
      dbName: config.service.databases[dbConnectionName].dbName,
    });
  } catch (err: any) {
    logger.error(`Could not connect to <${dbConnectionName}>: ${err}.`);
    process.exit(1);
  }
};
