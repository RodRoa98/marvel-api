import { Router } from 'express';

import Logger from '../../lib/logger';
import Config from '../../utils/config';

import { catchError } from '../../helpers/error.helper';
import * as AuthMiddleware from '../../middleware/auth-middleware';
import Controller from './marvel.controller';

const router: Router = Router();
const controller = new Controller();

const logger = Logger.getLogger('marvel-route');
const config = Config.get();

const auth = AuthMiddleware.authenticate({ logger, config });

/**
 * Get Marvel Characters list
 * @route GET /marvel
 * @group Marvel - operations
 * @operationId findCharacters
 * @produces application/json
 * @returns {Array.<MarvelCharacters>} 200 - An array of marvel characters
 * @returns {Error.model} 500 - Unexpected error
 * @security JWT
 */
// Retrieve all Marvel Characters
// router.get('/characters', auth, catchError(controller.findCharacters));
router.get('/characters', catchError(controller.findCharacters));

export default router;
