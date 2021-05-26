import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import SectionsClientController from "./sectionsClient.controller";
import { body } from "express-validator";

import express from "express";

export class SectionsClientRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "MenuAdminRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/clientebo/section/register`)
      .post(
        SectionsClientController.registerSectionsClient
      )
      
      this.app
      .route(`/clientebo/section`)
      .get(SectionsClientController.getAll);

      this.app
      .route(`/clientebo/section/:sectionId`)
      .delete(SectionsClientController.deleteById);
      
      this.app.put(`/clientebo/section/:sectionId`, [
        SectionsClientController.update,
    ]);

      

    return this.app;
  }
}