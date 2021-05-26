import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import MenuAdminController from "./menuAdmin.controller";
import { body } from "express-validator";

import express from "express";

export class MenuAdminRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "MenuAdminRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/adminbo/menu/register`)
      //    .all(
      //      AuthValidationMiddleware.validJWTNeeded,
      //    )
      .post(
        /*     body("name").isString().notEmpty(),
        body("idApi").isString().notEmpty(),
        body("method").isString().notEmpty(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,*/
        MenuAdminController.registerMenu
      );

    this.app
      .route(`/adminbo/menu/:role`)

      .get(MenuAdminController.getByRole);
    this.app
      .route(`/adminbo/menu/:menuId`)

      .delete(MenuAdminController.deleteById);

    this.app.put(`/adminbo/menu/:menuId`, [MenuAdminController.update]);

    return this.app;
  }
}
