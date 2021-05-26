import { CRUD } from '../../common/interfaces/crud.interface'
import debug from 'debug'
import MobileAppDao from './mobileapp.dao'

const log: debug.IDebugger = debug("app:mobileApp-service");

class MobileAppService implements CRUD {

  async create(resource: mobileAppModel.create) {
    return MobileAppDao.addMovileAppServices(resource);
  }

  async getByEmpresaId(empresaId: string) {
    return MobileAppDao.getByEmpresaId(empresaId);
  }

  async deleteByEmpresaId(empresaId: string) {
    return MobileAppDao.deleteByEmpresaId(empresaId);
  }

  async updateByEmpresaId(empresaId: string, resource: mobileAppModel.update) {
    return MobileAppDao.updateByEmpresaId(empresaId, resource);
  }

}

export default new MobileAppService();
