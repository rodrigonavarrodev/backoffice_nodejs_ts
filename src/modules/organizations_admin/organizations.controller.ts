import express from "express";

import debug from "debug";
import OrganizationsService from "./organizations.service";

const log: debug.IDebugger = debug("app:blank-controller");

class OrganizationsController {
  async register(req: express.Request, res: express.Response) {
    try {
      await OrganizationsService.registerOrganization(req.body);
      return res
        .status(200)
        .send({ msg: "Organizacion registada correctamente" });
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
      const response = await OrganizationsService.getAccountById(
        req.params.organizationId
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
      await OrganizationsService.deleteOrganizationById(req.params.organizationId);
      return res.status(200).send({ msg: 'Organizacion eliminada correctamente.' });
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
      const response = await OrganizationsService.updateById(req.body, req.params.organizationId);
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async testInstance(req: express.Request, res: express.Response) {
    try {
      const instance = await OrganizationsService.checkInstance(req.body.url);
      if (instance == "Instancia no válida") {
        return res.status(400).send({ errors: {msg: "Instancia no válida"}});
      }
      const login = await OrganizationsService.login(instance, req.body.url, req.body.usuario, req.body.password);
      if (login){
        return res.status(200).send({msg: {status: 'ok', token: login}});
      }
      return res.status(400).send({msg: {status: 'Datos incorrectos.'}});
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async getAll(req: express.Request, res: express.Response) {
    try {
      const response = await OrganizationsService.getAll();
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

}

export default new OrganizationsController();
