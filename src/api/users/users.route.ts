import { Router } from 'express';

import Logger from '../../lib/logger';
import Config from '../../utils/config';

import { catchError } from '../../helpers/error.helper';
import * as AuthMiddleware from '../../middleware/auth-middleware';
import Controller from './users.controller';

const router: Router = Router();
const controller = new Controller();

const logger = Logger.getLogger('users-route');
const config = Config.get();

const auth = AuthMiddleware.authenticate({ logger, config });

/**
 * Get users list
 * @route GET /users
 * @param {string} typeRes.query to: BACKOFFICE - optional
 * @param {string} email.query optional
 * @group Users - operations
 * @operationId findAll
 * @produces application/json
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error.model} 500 - Unexpected error
 * @security JWT
 */
// Retrieve all Users
router.get('/', auth, catchError(controller.findAll));

/**
 * Register user
 * @route POST /users
 * @param {UserRegisterReq.model} body.body.required An object of user
 * @group Users - operations
 * @operationId register
 * @produces application/json
 * @returns {UserRegisterRes.model} 201 - Created
 * @returns {} 404 - Specified user not found
 * @returns {Error.model} 500 - Unexpected error
 */
router.post('/', catchError(controller.register));

/**
 * Update user
 * @route POST /users
 * @param {UserUpdateReq.model} body.body.required An object of user
 * @group Users - operations
 * @operationId update
 * @produces application/json
 * @returns {UserUpdateRes.model} 200 - Ok
 * @returns {} 404 - Specified user not found
 * @returns {Error.model} 500 - Unexpected error
 */
router.put('/', catchError(controller.update));

/**
 * Update password
 * @route PATCH /users/{id}/change-password
 * @param {integer} id.path.required id - eg: 1
 * @param {ChangePasswordReq.model} body.body.required Passwords of a user
 * @group Users - User entity operations
 * @operationId changePassword
 * @produces application/json
 * @returns {Success.model} 200 - Success
 * @returns {} 400 - Invalid current password
 * @returns {} 404 - Specified user not found
 * @returns {Error.model} 500 - Unexpected error
 * @security JWT
 */
router.patch('/:id/change-password', auth, catchError(controller.changePassword));

export default router;
