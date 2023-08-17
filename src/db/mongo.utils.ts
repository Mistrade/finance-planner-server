import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import * as process from 'process';

export const getMongoConfig =
  async (): Promise<MongooseModuleFactoryOptions> => {
    return {
      uri: getMongoUri(),
    };
  };

export const getMongoUri = () => {
  const host = process.env.MONGO_HOST;
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const dbName = process.env.MONGO_DEFAULT_DB_NAME;
  const port = process.env.MONGO_PORT;

  return `mongodb://${username}:${password}@${host}:${port}/${dbName}?authMechanism=DEFAULT`;
};
