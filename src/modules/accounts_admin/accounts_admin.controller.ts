import express from "express";
import AccountsAdminService from "./accounts_admin.service";
import multer from  'multer'

import debug from "debug";

const log: debug.IDebugger = debug("app:accounts-controller");

class AccountsAdminController {
  async register(req: express.Request, res: express.Response) {
    try {
      await AccountsAdminService.registerUser(req.body);
      return res.status(200).send({ msg: "Usuario registrado correctamente." });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async authenticate(req: express.Request, res: express.Response) {
    try {
      const response = await AccountsAdminService.authenticateUser(req.body);
      return res.status(200).send(response);
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
      const response = await AccountsAdminService.getAccountById(
        req.params.userId
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
      await AccountsAdminService.deleteAccountById(req.params.userId);
      return res.status(200).send({ msg: "Usuario eliminado correctamente" });
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
      const response = await AccountsAdminService.updateById(
        req.body,
        req.params.userId
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

  async getOne(req: express.Request, res: express.Response) {
    try {
      console.log(req.jwt);

      const account = await AccountsAdminService.getOne(req.jwt.userId);
      if (!account) {
        return res
          .status(200)
          .send({ msg: "No hay datos asociados para el usuario ingresado" });
      }
      return res.status(200).send(account);
    } catch (error) {
      return res.status(400).send({ errors: [error] });
    }
  }
 
  async getAll(req: express.Request, res: express.Response) {
    try {
      console.log(req.jwt);

      const response = await AccountsAdminService.getAll();
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async uploadProfileImage(req: express.Request, res: express.Response) {
    try {
      console.log(req.files, req.jwt.userId);
      
      await AccountsAdminService.uploadProfileImage(req.files, req.jwt.userId); // blobName, stream
      return res.status(200).send({ msg: "Imágen Subida Correctamente." });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }
  async getProfileImage(req: express.Request, res: express.Response) {
    try {
      const response = await AccountsAdminService.getProfileImage(req.jwt.userId);
      return res.status(200).send(response);
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

  async deleteProfileImage(req: express.Request, res: express.Response) {
    try {
      await AccountsAdminService.deleteProfileImage(req.jwt.userId);
      return res.status(200).send({ msg: 'Imágen eliminada correctamente.' });
    } catch (error) {
      if (error.msg) {
        return res.status(400).send({ errors: [error] });
      } else {
        return res.status(400).send({ errors: [error.message] });
      }
    }
  }

}

export default new AccountsAdminController();
