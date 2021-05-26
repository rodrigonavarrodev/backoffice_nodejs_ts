import { CommonRoutesConfig } from "../../common/common.routes.config";
import { body } from "express-validator";

import express from "express";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import OrganizationsMiddleware from "./organizations.middleware";
import OrganizationsController from "./organizations.controller";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";

export class OrganizationRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "OrganizationRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/adminbo/organizaciones`)
      .post(
        body("razonSocial").isString().notEmpty(),
        body("cuit").isString().notEmpty(),
        body("psp").isString().notEmpty(),
        body("telefono").isString(),
        body("email").isEmail().notEmpty(),
        body("instancias").isArray().optional(),
        body("modulos").isArray().optional(),
        //AuthValidationMiddleware.validJWTNeeded,
        //AuthValidationMiddleware.isAdmin,
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        OrganizationsMiddleware.validateSameCuitDoesntExist,
        OrganizationsMiddleware.validateSameEmailDoesntExist,
        OrganizationsController.register
      );
      

    this.app
    .route(`/adminbo/organizaciones`)
    .get(
      //AuthValidationMiddleware.validJWTNeeded,
      //AuthValidationMiddleware.isAdmin,
      OrganizationsController.getAll
      );

    this.app
      .route(`/adminbo/organizaciones/:organizationId`)
      .all(
        //AuthValidationMiddleware.validJWTNeeded,
        OrganizationsMiddleware.validateOrganizationExists
      )
      .get(OrganizationsController.getById)
      .delete(OrganizationsController.deleteById);
    this.app.put(`/adminbo/organizaciones/:organizationId`, [
      body("razonSocial").isString().optional(),
      body("cuit").isString().optional(),
      body("psp").isString().optional(),
      body("telefono").isString().optional(),
      body("email").isEmail().optional(),
      body("instancias").isArray().optional(),
      body("modulos").isArray().optional(),
      //AuthValidationMiddleware.validJWTNeeded,
      //AuthValidationMiddleware.isAdmin,
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      OrganizationsMiddleware.validateSameCuitDoesntExist,
      OrganizationsMiddleware.validateSameEmailDoesntExist,
      OrganizationsController.update,
    ]);

    this.app
      .route(`/adminbo/testearinstancia`)
      .post(
        body("url").isString().notEmpty(),
        body("usuario").isString(),
        body("password").isString(),
        //AuthValidationMiddleware.validJWTNeeded,
        //AuthValidationMiddleware.isAdmin,
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        OrganizationsController.testInstance
      );

    return this.app;
  }
}
