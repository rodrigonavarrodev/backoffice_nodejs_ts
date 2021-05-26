import express from "express";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { Jwt } from "../../common/types/jwt";
import AccountsAdminService from "../../modules/accounts_admin/accounts_admin.service";
import { EmployeesRoutes } from "../../modules/employees_client/employees.routes.config";
import employeesService from "../../modules/employees_client/employees.service";

class AuthValidationMiddleware {
  async validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).send();
        } else {
          req.jwt = jwt.verify(authorization[1], config.secret) as Jwt;
          next();
        }
      } catch (err) {
        return res.status(403).send({ msg: "Token no válido." });
      }
    } else {
      return res.status(401).send({ msg: "No autorizado." });
    }
  }


  async isAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    console.log("req", req.jwt.userId);
    const user: any = await AccountsAdminService.getAccountById(req.jwt.userId);
    if (user.role === "Admin") {
      next();
    } else {
      return res.status(401).send({
        msg: `Tu rol es ${user.role}. Necesitas el rol Admin para realizar esta operación`,
      });
    }
  }

  async isClient(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await employeesService.getEmployeeById(req.jwt.userId, req.jwt.empresaId);
   
    if (!user) {
      return res.status(401).send({
        msg: "Tu usuario no pertence a un empleado de esta Organizacion",
      });
    } else if (user.boRole === "Client") {
      next();
    } else {
      return res
        .status(401)
        .send({ msg: "No tenes permiso para entar al BO cliente" });
    }
  }

  async hasPermissions(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await employeesService.getEmployeeById(req.jwt.userId, req.jwt.empresaId);
    const services = user.role.services;
  
    
    const result = services.find(
      (user: any) => user.name === req.url && user.method === req.method
    );

    if (!result) {
      return res
        .status(401)
        .send({ msg: "No tenes permisos para ejecutar este servicio" });
    } else {
      next();
    }
  }
}

export default new AuthValidationMiddleware();
