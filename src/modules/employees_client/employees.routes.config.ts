import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import EmployeesController from "./employees.controller";
import EmployeesMiddleware from "./employees.middleware";
import { body } from "express-validator";

import express from "express";

export class EmployeesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "EmployeesRoutes");
  }

  configureRoutes() {
    this.app.route(`/clientebo/registrarempleado`).post(
      body("firstname").isString().notEmpty(),
      body("lastname").isString().notEmpty(),
      body("email").isEmail().notEmpty(),
      body("sector").isString().notEmpty(),
      body("phone").isString().notEmpty(),
      body("role").isString().notEmpty(),
      AuthValidationMiddleware.validJWTNeeded,
      AuthValidationMiddleware.isClient,
      AuthValidationMiddleware.hasPermissions,
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      EmployeesMiddleware.validateSameEmailDoesntExist,
      //EmployeesMiddleware.validateRegister,
      EmployeesController.register
    );

    this.app
    .route(`/clientebo/autenticarse`)
    .post(
      body("email").isEmail(),
      body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("El password debe tener 6 números")
        .matches(/^[0-9]+$/)
        .optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      EmployeesController.authenticate
    );

    this.app
      .route("/clientebo/infoempleado")
      .get(
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isClient,
        EmployeesController.getOne
      );

    this.app
      .route("/clientebo/empleados")
      .get(
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isClient,
        EmployeesController.getAll
      );

    this.app
      .route("/clientebo/:userId")
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isClient,
        //AuthValidationMiddleware.hasPermissions
      )
      .put(
        body("firstname").isString().optional(),
        body("lastname").isString().optional(),
        body("email").isEmail().optional(),
        body("sector").isString().optional(),
        body("phone").isString().optional(),
        body("role").isString().optional(),
        body("email").isString().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        EmployeesMiddleware.validateSameEmailDoesntExist,
        EmployeesController.update
      )
      .get(EmployeesController.getById)
      .delete(EmployeesController.deleteById);
    return this.app;
  }
}
