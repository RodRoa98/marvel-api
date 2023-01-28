import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { IConfig } from './config-interfaces';

namespace Config {
  export function get() {
    const fileContent = fs.readFileSync(`./config/config.${process.env.NODE_ENV}.yml`, 'utf8');
    const data = yaml.load(fileContent) as IConfig;

    return data.default;
  }
}

export default Config;
