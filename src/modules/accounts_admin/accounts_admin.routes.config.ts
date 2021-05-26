import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import AuthValidationMiddleware from "../../common/middleware/auth.validation.middleware";
import AccountsAdminController from "./accounts_admin.controller";
import AccountsMiddleware from "./accounts_admin.middleware";
import { body } from "express-validator";

import multer from "multer";
let upload = multer({ storage: multer.memoryStorage() });

import express from "express";

export class AccountAdminRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AccountAdminRoutes");
  }

  configureRoutes() {
    // DAR DE ALTA UN USUARIO DE AP
    this.app.route(`/adminbo/registrarusuario`).post(
      body("name").isString().notEmpty(),
      body("email").isEmail().notEmpty(),
      body("role").isString().notEmpty(),
      body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("El password debe tener 6 números")
        .matches(/^[0-9]+$/),
      body("confirmPassword").isString(),
      //AuthValidationMiddleware.validJWTNeeded,
      //AuthValidationMiddleware.isAdmin,
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AccountsMiddleware.validateSameEmailDoesntExist,
      AccountsMiddleware.validateRegister,
      AccountsAdminController.register
    );

    // LOGIN DE UN USUARIO DE AP
    this.app.route(`/adminbo/autenticarse`).post(
      body("email").isEmail(),
      body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("El password debe tener 6 números")
        .matches(/^[0-9]+$/)
        .optional(),
      body("fingerprint").isBoolean().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AccountsAdminController.authenticate
    );

    this.app
      .route("/adminbo/infousuario")
      .get(
        AuthValidationMiddleware.validJWTNeeded,
        AccountsAdminController.getOne
      );

    this.app
      .route("/adminbo/usuarios")
      .get(
        AuthValidationMiddleware.validJWTNeeded,
        AccountsAdminController.getAll
      );

    this.app
      .route("/adminbo/profileimage")
      .get(
        AuthValidationMiddleware.validJWTNeeded,
        AccountsAdminController.getProfileImage
      )
      .put(
        AuthValidationMiddleware.validJWTNeeded,
        upload.any(),
        AccountsAdminController.uploadProfileImage
      )
      .delete(
        AuthValidationMiddleware.validJWTNeeded,
        AccountsAdminController.deleteProfileImage
      )

    this.app.param(`userId`, AccountsMiddleware.extractUserId);
    this.app
      .route(`/adminbo/:userId`)
      .all(
        AuthValidationMiddleware.validJWTNeeded,
        AccountsMiddleware.validateUserExists
      )
      .get(AccountsAdminController.getById)
      .delete(AccountsAdminController.deleteById);

    this.app
      .route(`/adminbo/:userId`)
      .put(
        body("name").isString().optional(),
        body("email").isEmail().optional(),
        body("role").isString().optional(),
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.isAdmin,
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AccountsMiddleware.validateSameEmailDoesntExist,
        AccountsAdminController.update
      );

    return this.app;
  }
}
