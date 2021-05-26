import express from "express";
import AccountsAdminService from "./accounts_admin.service";

class AccountsMiddleware {
  async validateRegister(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.confirmPassword != req.body.password) {
      res.status(400).send({
        errors: [
          { msg: `El campo confirmar password no coincide con el password` },
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
    const account = await AccountsAdminService.getAccountByEmail(
      req.body.email
    );
    if (account) {
      res.status(400).send({
        errors: [{ msg: `Email ${req.body.email} ya está siendo utilizado` }],
      });
    } else {
      next();
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await AccountsAdminService.getAccountById(req.params.userId);
    if (user) {
      next();
    } else {
      res.status(404).send({
        errors: [`Usuario ${req.params.userId} no encontrado.`],
      });
    }
  }
}

export default new AccountsMiddleware();
