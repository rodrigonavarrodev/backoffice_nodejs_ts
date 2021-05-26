import { CommonRoutesConfig } from '../../common/common.routes.config'
import AuthValidationMiddleware from '../../common/middleware/auth.validation.middleware'
import MobileAppController from './mobileapp.controller'
import { body } from 'express-validator'

import express from 'express';

export class MobileAppRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, "MobileAppRoutes");
    }

    configureRoutes() {

        this.app
            .route(`/mobileapp/:empresaId`)
            .get(
                AuthValidationMiddleware.validJWTNeeded,
                MobileAppController.get
            );

        return this.app;
    }
}