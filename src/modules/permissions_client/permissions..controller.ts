import express from "express";
import PermissionsService from "./permissions.service";
import RedisService from '../../common/services/redis.service'

import debug from "debug";
import { error } from "winston";

const log: debug.IDebugger = debug("app:permissions-controller");

class PermissionsController {
  async register(req: express.Request, res: express.Response) {
    try {  
      const redisConn = await RedisService.checkRedisConnection();
      if (!redisConn) {return res.status(400).send({ msg: 'Servicio de Redis caído.' })};
      const permission = await PermissionsService.registerPermission(req.body, req.jwt.empresaId);
      const redisData = await PermissionsService.getPermissionById(permission._id);
      await RedisService.setJSONData(`roleId:${permission._id}`, redisData);
      return res.status(200).send({ msg: "Permiso registrado correctamente." });
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
      const response = await PermissionsService.getPermissionById(
        req.params.permisoId
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
      const response = await PermissionsService.getAll(req.jwt.empresaId);
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async put(req: express.Request, res: express.Response) {
    try {
      const redisConn = await RedisService.checkRedisConnection();
      if (!redisConn) {return res.status(400).send({ msg: 'Servicio de Redis caído.' })};
      const permissionUpdated = await PermissionsService.updatePermissionById(req.params.permisoId, req.body);
      const redisData = await PermissionsService.getPermissionById(req.params.permisoId);
      await RedisService.setJSONData(`roleId:${req.params.permisoId}`, redisData);
      return res.status(200).send({ msg: "Permiso actualizado correctamente." });
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
      const redisConn = await RedisService.checkRedisConnection();
      if (!redisConn) {return res.status(400).send({ msg: 'Servicio de Redis caído.' })};
      await PermissionsService.deletePermissionById(req.params.permisoId);
      await RedisService.delByKey(`roleId:${req.params.permisoId}`);
      return res.status(200).send({ msg: "Permiso eliminado correctamente." });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

}

export default new PermissionsController();
