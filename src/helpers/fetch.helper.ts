import { HTTP_STATUS_TO_RETRY } from '../constants/http-status.constant';
import { compose } from '../utils';
import * as fetch from 'node-fetch';

export function to<T>(promise: Promise<T>, errInfo?: string | object): Promise<T[] | [any, T]> {
  return promise
    .then((res) => [null, res])
    .catch((err) => {
      if (errInfo) {
        Object.assign(err, errInfo);
      }

      return [err, null];
    });
}
export const queryString = (params: {}) => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
};

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const defaultRetry = {
  retries: 3,
  retryDelay: 1000,
};

export function fetcher(url, opts = {}) {
  return fetch.default(url, opts)
    .then((r) => {
      const { status, statusText } = r;

      return r.ok ? r : Promise.reject({ status, statusText });
    })
    .then((r) => r.json());
}

export const fetchTo = compose(to, fetcher);

export const retryFetch = (url: string, options: {}) => {
  const mergeDefaultRetryOptions = { ...defaultRetry, ...options };
  const { retries, retryDelay, ...opts } = mergeDefaultRetryOptions;

  return new Promise((resolve, reject) => {
    const recursiveFetch = async (retry: number) => {
      const [fetchErr, fecthRes] = await fetchTo(url, opts);
      const canRetry = HTTP_STATUS_TO_RETRY.includes(fetchErr?.status);
      if (fetchErr) {
        if (!canRetry) {
          return reject(fetchErr);
        }
        if (retry > 0) {
          await delay(retryDelay);
          recursiveFetch(--retry);
        } else {
          reject(fetchErr);
        }
      } else {
        resolve(fecthRes);
      }
    };

    recursiveFetch(retries);
  });
};
