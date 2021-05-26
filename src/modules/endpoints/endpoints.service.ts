import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import EndpointsDao from "./endpoints.dao";

const log: debug.IDebugger = debug("app:endpoints-service");

class EndpointsService implements CRUD {
  async create() {
    return "";
  }

  async registerEndpoint(resource: EndpointsModel.registerEndpoint) {
    return EndpointsDao.addEndpoint(resource);
  }

  async getEndpointById(id: string) {
    const endpoint = await EndpointsDao.getEndpointById(id);
    if (endpoint) {
      return endpoint;
    } else {
      return null;
    }
  }

  async getAll() {
    return await EndpointsDao.getAllEndpoints();
  }

  endpointDetails(endpoint: any) {
    const {
      name,
      idApi,
      method,
      category,
    } = endpoint;
    return {
      name,
      idApi,
      method,
      category
      
    };
  }

}

export default new EndpointsService();
