import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import SectionsDao from "./sectionsClient.dao";

const log: debug.IDebugger = debug("app:endpoints-service");

class SectionsService implements CRUD {
  async create() {
    return "";
  }

  async registerSection(resource: SectionsModel.registerSection) {
    return SectionsDao.addSection(resource);
  }
 
  async getAll() {
    return await SectionsDao.getAllSections();
  }

  async deleteSectionById(id: string) {
    const sectionDeleted = await SectionsDao.deleteSectionById(id);
    return { sectionDeleted };
  }

  async updateById(resource: SectionsClientModel.registerSection, id: string) {
    const section = await SectionsDao.updateSectionById(id, resource);
    return { section };
  }

}

export default new SectionsService();
