import express from "express";
import MenuService from "./menuClient.service";

import debug from "debug";

const log: debug.IDebugger = debug("app:menu-controller");

class MenuClientController {

    async registerMenu(req: express.Request, res: express.Response) {
    try {
      await MenuService.registerMenu(req.body);
      return res.status(200).send({ msg: "Menú dado de alta Correctamente" });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }


  async getByRole(req: express.Request, res: express.Response) {
    try {
      const response = await MenuService.getMenuByRole(
        req.params.role
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
      await MenuService.deleteMenuById(req.params.menuId);
      return res.status(200).send({ msg: 'Menú eliminado correctamente.' });
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
      const response = await MenuService.updateById(req.body, req.params.menuId);
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

export default new MenuClientController();
