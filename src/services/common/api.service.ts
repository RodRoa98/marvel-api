import { queryString, retryFetch } from '../../helpers/fetch.helper';

export interface IOptionsRequest {
  headers?: {
    [header: string]: any;
  };
  queryParams?: {};
  retries?: number;
  retryDelay?: number;
}

export abstract class ApiService {
  public static async get(apiUrl: string, opts: IOptionsRequest = {}): Promise<any> {
    apiUrl = this.getUrl(apiUrl, opts);
    opts.headers = this.getHeaders(opts.headers);
    const options = {
      method: 'GET',
      ...opts,
    };

    return retryFetch(apiUrl, options);
  }

  public static async put(apiUrl: string, body: {} = {}, opts: IOptionsRequest = {}): Promise<any> {
    apiUrl = this.getUrl(apiUrl, opts);
    opts.headers = this.getHeaders(opts.headers);
    const options = {
      method: 'PUT',
      body: JSON.stringify(body),
      ...opts,
    };

    return retryFetch(apiUrl, options);
  }

  private static getHeaders(headers: {} = {}): {} {
    return { 'Content-Type': 'application/json', ...headers };
  }

  private static getUrl(apiUrl: string, opts: IOptionsRequest = {}): string {
    let url = apiUrl;
    if (opts.queryParams) {
      url += `?${queryString(opts.queryParams)}`;
    }

    return url;
  }
}
