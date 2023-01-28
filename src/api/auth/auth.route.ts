import { Router } from 'express';
import { catchError } from '../../helpers/error.helper';
import Controller from './auth.controller';

const router: Router = Router();
const controller = new Controller();

/**
 * Authentication of impersonate
 * @route POST /auth/authenticate/impersonate
 * @group Auth - operations
 * @operationId authImpersonate
 * @param {Object} body.body.required
 * @produces application/json
 * @returns {Authenticated.model} 200 - Authenticated
 * @returns {Error.model} 500 - Unexpected error
 * @security JWT
 */
router.post('/authenticate', catchError(controller.authenticate));

/**
 * Refresh authentication token
 * @route POST /auth/refresh
 * @group Auth - Authorization/authentication operations
 * @operationId refreshToken
 * @param {RefreshParams.model} body.body - refresh token
 * @produces application/json
 * @returns {Authenticated.model} 200 - Authenticated
 * @returns {Error.model} 403 - Invalid token
 * @returns {Error.model} 500 - Unexpected error
 */
// Refresh a token
router.post('/refresh', catchError(controller.refresh));

export default router;
