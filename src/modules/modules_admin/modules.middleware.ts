import express from "express";
import ModulesService from "./modules.service";

class ModulesMiddleware {
  async validateModuleDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const module = await ModulesService.getModuleByName(req.body.name);
    if (module) {
      res.status(400).send({
        errors: [
          {
            msg: `Ya existe un modulo con el nombre ${req.body.name}`,
          },
        ],
      });
    } else {
      next();
    }
  }

  async extractModuleId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    req.body.id = req.params.moduleId;
    next();
}
}

export default new ModulesMiddleware();
