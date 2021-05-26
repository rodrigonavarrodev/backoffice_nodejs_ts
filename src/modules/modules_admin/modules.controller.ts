import express from 'express'
import ModulesService from './modules.service';


import debug from "debug"

const log: debug.IDebugger = debug("app:modules-controller");

class ModulesController {
  async register(req: express.Request, res: express.Response) {
    try {
      await ModulesService.registerModule(req.body);
      return res
        .status(200)
        .send({ msg: "Modulo registrado correctamente" });
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
      const response = await ModulesService.getModuleById(
        req.params.moduleId
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
      await ModulesService.deleteModuleById(req.params.moduleId);
      return res.status(200).send({ msg: 'Modulo eliminado correctamente.' });
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
      const response = await ModulesService.updateById(req.body, req.params.moduleId);
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
      const response = await ModulesService.getAll();
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

export default new ModulesController();
