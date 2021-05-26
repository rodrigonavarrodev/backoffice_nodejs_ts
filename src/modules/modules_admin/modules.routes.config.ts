import { CommonRoutesConfig } from "../../common/common.routes.config";
import { body } from "express-validator";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import ModulesMiddleware from "./modules.middleware";
import ModulesController from "./modules.controller";

import express from "express";
import modulesMiddleware from "./modules.middleware";

export class ModulesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ModulesRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/adminbo/modulos`)
      .all(
        //AuthValidationMiddleware.validJWTNeeded,
      )
      .post(
        body("name").isString().notEmpty(),
        body("services").isArray().notEmpty(),
        //AuthValidationMiddleware.isAdmin,
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        ModulesMiddleware.validateModuleDoesntExist,
        ModulesController.register
      )
      .get(ModulesController.getAll);

    this.app.param(`moduleId`, ModulesMiddleware.extractModuleId);
    this.app
      .route(`/adminbo/modulos/:moduleId`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        ModulesMiddleware.validateModuleDoesntExist
      )
      .get(ModulesController.getById)
      .delete(ModulesController.deleteById);
    this.app.put(`/adminbo/modulos/:moduleId`, [
      body("name").isString().optional(),
      body("services").isArray().optional(),
      AuthValidationMiddleware.validJWTNeeded,
      AuthValidationMiddleware.isAdmin,
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      ModulesMiddleware.validateModuleDoesntExist,
      ModulesController.update,
    ]);

    return this.app;
  }
}
