import express from "express";
//import EndpointsService from "./endpoints.service";
import SectionsService from "./sections.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:sections-controller");

class SectionsClientController {

    async registerSectionsClient(req: express.Request, res: express.Response) {
      try {
        await SectionsService.registerSection(req.body);
        return res.status(200).send({ msg: "Sección Agregada Correctamente" });
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
      const response = await SectionsService.getAll();
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
      await SectionsService.deleteSectionById(req.params.sectionId);
      return res.status(200).send({ msg: 'Sección eliminada correctamente.' });
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
      const response = await SectionsService.updateById(req.body, req.params.sectionId);
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

export default new SectionsClientController();
