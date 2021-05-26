import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import EndpointsController from "./endpoints.controller";
import { body } from "express-validator";

import express from "express";

export class EndpointRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "EndpointsRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/endpoints`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
      )
      .post(
        body("name").isString().notEmpty(),
        body("idApi").isString().notEmpty(),
        body("method").isString().notEmpty(),
        body("category").isString().notEmpty(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        EndpointsController.register
      )
      .get(EndpointsController.getAll);

    this.app
      .route(`/endpoints/:endpointId`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        //OrganizationsMiddleware.validateUserExists
      )
      .get(EndpointsController.getById);

    return this.app;
  }
}
