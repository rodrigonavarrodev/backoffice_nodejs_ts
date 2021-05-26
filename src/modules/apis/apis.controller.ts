import express from 'express'
import ApisService from './apis.service'

import debug from "debug"

const log: debug.IDebugger = debug("app:blank-controller");

class ApisController {
    async getAll(req: express.Request, res: express.Response) {
        try {
          const response = await ApisService.getAll();
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

export default new ApisController();
