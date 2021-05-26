import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import MenuClientController from "./menuClient.controller";
import { body } from "express-validator";

import express from "express";

export class MenuClientRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "MenuAdminRoutes");
  }

  configureRoutes() {
    this.app.route(`/clientebo/menu/register`)
    .post(MenuClientController.registerMenu);

    this.app.route(`/clientebo/menu/:role`)
    .get(MenuClientController.getByRole);
    
    this.app
      .route(`/clientebo/menu/:menuId`)

      .delete(MenuClientController.deleteById);

    this.app.put(`/clientebo/menu/:menuId`, [MenuClientController.update]);

    return this.app;
  }
}
