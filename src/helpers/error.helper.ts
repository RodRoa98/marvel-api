import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant';
import { GeneralError } from '../utils/error';
import * as httpStatus from 'http-status';

export const catchError = (ftn: (rq: Request, rs: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return ftn(req, res).catch((err: any) => {
      next(err);
    });
  };
};

export const throwBusinessError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.BUSINESS_ERROR, message);
};

export const throwExternalError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.BUSINESS_ERROR, message);
};

export const throwDBError = (message: any = '') => {
  throw new GeneralError(HTTP_STATUS.DB_ERROR, message);
};

export const errorHandler = (err: GeneralError | any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = err instanceof GeneralError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    statusText: HTTP_STATUS[statusCode] || HTTP_STATUS[HTTP_STATUS.INTERNAL_SERVER_ERROR],
    messsage: err.message || HTTP_STATUS[`${statusCode}_MESSAGE`],
  });
};

export const notFound = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    message: 'Requested resource not found',
  });
  res.end();
};
