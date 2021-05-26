import express from "express";
import EndpointsService from "./endpoints.service";

import debug from "debug";

const log: debug.IDebugger = debug("app:endpoint-controller");

class EndpointsController {
  async register(req: express.Request, res: express.Response) {
    try {
      await EndpointsService.registerEndpoint(req.body);
      return res.status(200).send({ msg: "Servicio registrado correctamente" });
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
      const response = await EndpointsService.getEndpointById(
        req.params.endpointId
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

  async getAll(req: express.Request, res: express.Response) {
    try {
      log(req.jwt);
      const response = await EndpointsService.getAll();
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

export default new EndpointsController();
