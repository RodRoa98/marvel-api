import { Request, Response } from 'express';
import { SKIP_FIELDS } from '../constants/general.constant';
import { throwDBError } from '../helpers/error.helper';
import { to } from '../helpers/fetch.helper';
import { Created, NotFound, Ok } from '../helpers/http.helper';

export default class BaseController {
  public model: any;

  constructor(model) {
    this.model = model;
    this.findAll = this.findAll.bind(this);
    this.save = this.save.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
  }

  public async findAll(req: Request, res: Response) {
    const [err, data] = await to(this.model.find({}, SKIP_FIELDS).exec());

    if (err) {
      throwDBError(err);
    }

    data ? Ok(res, data) : NotFound(res);
  }

  public async getAllByQuery(req: Request, res: Response) {
    const [err, data] = await to(this.model.find(req.query, SKIP_FIELDS).exec());

    if (err) {
      throwDBError(err);
    }

    data ? Ok(res, data) : NotFound(res);
  }

  public async save(req: Request, res: Response) {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    const [err] = await to(this.model.insertMany(body));

    if (err) {
      throwDBError(err);
    }

    body ? Created(res, body) : NotFound(res);
  }

  public async deleteAll(req: Request, res: Response) {
    const [err, data] = await to(this.model.deleteMany());

    if (err) {
      throwDBError(err);
    }

    return Ok(res, data);
  }
}
