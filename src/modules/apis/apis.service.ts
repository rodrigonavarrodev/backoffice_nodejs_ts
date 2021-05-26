import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import ApisDao from "./apis.dao";

const log: debug.IDebugger = debug("app:blanks-service");

class ApisService implements CRUD {
  async create() {
    return "";
  }

  async getAll() {
    const apis = await ApisDao.getAll();
    if (apis) {
      return apis;
    } else {
      return null;
    }
  }

  getApiDetailsMapped(apiArray: any) {
    return apiArray.map((x: any) => this.apiDetails(x));
  }

  apiDetails(api: any) {
    const {
      id,
      name
    } = api;
    return {
      id,
      name
    };
  }

}

export default new ApisService();
