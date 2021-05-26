import express from 'express'
import PermissionsService from './permissions.service';

class PermissionsMiddleware {

    async validatePermissionDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
        const module = await PermissionsService.getPermissionByName(req.body.name);
        if (module) {
          res.status(400).send({
            errors: [
              {
                msg: `Ya existe un Permiso con el nombre ${req.body.name}`,
              },
            ],
          });
        } else {
          next();
        }
      }

      async validatePermissionNameUnique(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
        const module = await PermissionsService.getPermissionByName(req.body.name);
        if (module) {
          if (req.params.permisoId == module.id) {return next()};
          res.status(400).send({
            errors: [
              {
                msg: `Ya existe un Permiso con el nombre ${req.body.name}`,
              },
            ],
          });
        } else {
          next();
        }
      }

    async extractPermissionId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.permisoId;
        next();
    }
}

export default new PermissionsMiddleware();