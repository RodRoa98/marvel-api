import * as httpStatus from 'http-status';

const BUSINESS_ERROR = 950;
const EXTERNAL_API_ERROR = 900;
const DB_ERROR = 500;

const myHttpStatus = { BUSINESS_ERROR, DB_ERROR, EXTERNAL_API_ERROR };

myHttpStatus[`${BUSINESS_ERROR}`] = 'Business error';
myHttpStatus[`${BUSINESS_ERROR}_NAME`] = 'BUSINESS_ERROR';
myHttpStatus[`${BUSINESS_ERROR}_MESSAGE`] = 'Indicates that exist a business error';

myHttpStatus[`${DB_ERROR}`] = 'BD error';
myHttpStatus[`${DB_ERROR}_NAME`] = 'DB_ERROR';
myHttpStatus[`${DB_ERROR}_MESSAGE`] = 'Indicates that exist a BD error';

myHttpStatus[`${EXTERNAL_API_ERROR}`] = 'External error';
myHttpStatus[`${EXTERNAL_API_ERROR}_NAME`] = 'EXTERNAL_API_ERROR';
myHttpStatus[`${EXTERNAL_API_ERROR}_MESSAGE`] = 'Indicates that exist an External API error';

export const HTTP_STATUS = { ...httpStatus, ...myHttpStatus };
export const HTTP_STATUS_TO_RETRY = [429, 503, 504];
