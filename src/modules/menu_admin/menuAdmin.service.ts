import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import MenuDao from "./menuAdmin.dao";

const log: debug.IDebugger = debug("app:endpoints-service");

class MenuService implements CRUD {
  async create() {
    return "";
  }

  async registerMenu(resource: MenuModel.registerMenu) {
    return MenuDao.addMenu(resource);
  }


  async getMenuByRole(role: any){
      return MenuDao.getMenusByRole(role);
  }

  async deleteMenuById(id: string) {
    const menuDeleted = await MenuDao.deletMenuById(id);
    return { menuDeleted };
  }

  async updateById(resource: MenuModel.registerMenu, id: string) {
    const menu = await MenuDao.updateMenuById(id, resource);
    return { menu };
  }


/* 
  async getAll() {
    return await SectionsDao.getAllSections();
  }



  async updateById(resource: SectionsModel.registerSection, id: string) {
    const section = await SectionsDao.updateSectionById(id, resource);
    return { section };
  }
*/
}

export default new MenuService();
