import { Router } from 'express';
import { catchError } from '../../helpers/error.helper';
import Controller from './health.controller';

const router: Router = Router();
const controller = new Controller();

router.get('/', catchError(controller.info));

export default router;
