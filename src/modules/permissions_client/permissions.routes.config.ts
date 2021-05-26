import {CommonRoutesConfig} from '../../common/common.routes.config'
import { body } from 'express-validator'
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from '../../common/middleware/auth.validation.middleware'
import PermissionsController from './permissions..controller'
import PermissionsMiddleware from './permissions.middleware'

import express from 'express';

export class PermissionsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PermissionsRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/clientebo/permisos`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isClient,
        AuthValidationMiddleware.hasPermissions,
      )
      .post(
        body("name").isString().notEmpty(),
        body("services").isArray().notEmpty(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        PermissionsMiddleware.validatePermissionDoesntExist,
        PermissionsController.register
      )
      .get(PermissionsController.getAll)

    this.app.param('permisoId', PermissionsMiddleware.extractPermissionId)
    this.app
      .route('/clientebo/permisos/:permisoId')
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isClient,
        AuthValidationMiddleware.hasPermissions,
      )
      .get(PermissionsController.getById)
      .delete(PermissionsController.deleteById)
    this.app.put(`/clientebo/permisos/:permisoId`, [
        body("name").isString().optional(),
        body("services").isArray().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        PermissionsMiddleware.validatePermissionNameUnique,
        PermissionsController.put
    ]);
  
    return this.app;
  }
}