import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import ModulesDao from "./modules.dao";

const log: debug.IDebugger = debug("app:blanks-service");

class ModulesService implements CRUD {
  async create() {
    return "";
  }

  async registerModule(resource: ModulesModel.registerModule) {
    return ModulesDao.addModule(resource);
  }

  async getModuleByName(name: string) {
    return ModulesDao.getModuleByName(name);
  }

  async getModuleById(id: string) {
    return ModulesDao.getModuleById(id);
  }

  async deleteModuleById(id: string) {
    const moduleDeleted = await ModulesDao.deleteModuleById(id);
    return { moduleDeleted };
  }

  async updateById(resource: ModulesModel.registerModule, id: string) {
    const module = await ModulesDao.updateModuleById(id, resource);
    return { module };
  }

  async getAll() {
    return await ModulesDao.getAllModules();
  }

}

export default new ModulesService();
