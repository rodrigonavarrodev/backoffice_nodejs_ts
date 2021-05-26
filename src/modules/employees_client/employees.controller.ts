import express from "express";
import EmployeesService from "./employees.service";
import jwt_decode from 'jwt-decode'

import debug from "debug";

const log: debug.IDebugger = debug("app:blank-controller");

class EmployeesController {
  async register(req: express.Request, res: express.Response) {
    try {
      await EmployeesService.registerEmployee(req.body, req.jwt.empresaId);
      return res
        .status(200)
        .send({ msg: "Empleado registrado correctamente " });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async authenticate(req: express.Request, res: express.Response) {
    try {
      const response = await EmployeesService.authenticateEmployee(req.body);
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async getOne(req: express.Request, res: express.Response) {
    try {
      const account = await EmployeesService.getById(req.jwt.userId);
      if (!account) {
        return res
          .status(200)
          .send({ msg: "No hay datos asociados para el usuario ingresado" });
      }
      return res.status(200).send(account);
    } catch (error) {
      return res.status(400).send({ errors: [error] });
    }
  }

  async getAll(req: express.Request, res: express.Response) {
    try {
      const response = await EmployeesService.getAll(req.jwt.empresaId);
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async update(req: express.Request, res: express.Response) {
    try {
      const response = await EmployeesService.updateById(
        req.body,
        req.params.userId
      );
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async getById(req: express.Request, res: express.Response) {
    try {
      const response = await EmployeesService.getById(
        req.params.userId
      );
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async deleteById(req: express.Request, res: express.Response) {
    try {
      await EmployeesService.deleteById(req.params.userId);
      return res.status(200).send({ msg: "Empleado eliminado correctamente" });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

}
export default new EmployeesController();
