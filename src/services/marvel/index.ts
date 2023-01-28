import { ApiService } from '../common/api.service';
import Config from '../../utils/config';

const config = Config.get();

export default class MarvelAPI {
  public static async getCharacters() {
    const opts = {
      queryParams: {
        apikey: config.service.external.marvelApi.apiKey,
        hash: config.service.external.marvelApi.hash,
        ts: config.service.external.marvelApi.ts,
      }
    }
    return ApiService.get(`${config.service.external.marvelApi.url}/characters`, opts);
  }
}
