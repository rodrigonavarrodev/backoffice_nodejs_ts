import express from "express";
import OrganizationsService from "./organizations.service";

class OrganizationsMiddleware {
  async validateSameCuitDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const account = await OrganizationsService.getAccountByCuit(req.body.cuit);
    if (account) {
      res.status(200).send({
        errors: [
          {
            msg: `El Cuit ${req.body.cuit} ingresado ya corresponde a una empresa`,
          },
        ],
      });
    } else {
      next();
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const account = await OrganizationsService.getAccountByEmail(
      req.body.email
    );
    if (account) {
      res.status(200).send({
        errors: [
          {
            msg: `El Email ${req.body.email} ingresado ya corresponde a una empresa`,
          },
        ],
      });
    } else {
      next();
    }
  }

  async validateOrganizationExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await OrganizationsService.getAccountById(req.params.organizationId);
    if (user) {
      next();
    } else {
      res.status(404).send({
        errors: [`Organzacion ${req.params.organizationId} no encontrada.`],
      });
    }
  }
}

export default new OrganizationsMiddleware();
