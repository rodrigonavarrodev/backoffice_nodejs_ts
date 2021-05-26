import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import SectionsAdminController from "./sectionsAdmin.controller";
import { body } from "express-validator";

import express from "express";

export class SectionsAdminRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "MenuAdminRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/adminbo/section/register`)
      .post(
        SectionsAdminController.registerSectionsAdmin
      )
      
      this.app
      .route(`/adminbo/section`)
      .get(SectionsAdminController.getAll);

      this.app
      .route(`/adminbo/section/:sectionId`)
      .delete(SectionsAdminController.deleteById);
      
      this.app.put(`/adminbo/section/:sectionId`, [
        SectionsAdminController.update,
    ]);

      

    return this.app;
  }
}