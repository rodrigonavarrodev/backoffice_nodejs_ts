import express from 'express'
import MobileAppService from './mobileapp.service'

import debug from "debug"

const log: debug.IDebugger = debug("app:mobileApp-controller");

class MobileAppController {

    async get(req: express.Request, res: express.Response) {
        try {
          const response = await MobileAppService.getByEmpresaId(req.params.empresaId);
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

export default new MobileAppController();
