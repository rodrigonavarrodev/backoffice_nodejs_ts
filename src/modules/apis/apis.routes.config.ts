import {CommonRoutesConfig} from '../../common/common.routes.config'
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import ApisController from './apis.controller'
import { body } from 'express-validator'

import express from 'express';

export class ApiRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ApiRoutes");
  }

  configureRoutes() {

    this.app
      .route(`/apis`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
      )
      .get(ApisController.getAll);
    
    return this.app;
  }
}