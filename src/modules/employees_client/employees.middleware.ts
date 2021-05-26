import express from "express";
import EmployeesService from './employees.service'

class EmployeesMiddleware {
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
    const account = await EmployeesService.getEmployeeByEmail(
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
}

export default new EmployeesMiddleware();
