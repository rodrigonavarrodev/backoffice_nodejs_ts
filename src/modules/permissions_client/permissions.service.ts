import { CRUD } from '../../common/interfaces/crud.interface'
import debug from 'debug'
import permissionsDao from './permissions.dao';
import RedisService from '../../../src/common/services/redis.service'

const log: debug.IDebugger = debug("app:permissions-service");

class PermissionsService implements CRUD {

    async create() {
        return '';
      }
    
    async registerPermission(resource: PermissionsModel.registerPermission, empresaId: string) { 
      const permission = await permissionsDao.addPermission(resource, empresaId);
      return permission
    }

    async getPermissionById(id: string) {
      return permissionsDao.getPermissionById(id);
    }

    async getPermissionByName(name: string) {
      return permissionsDao.getPermissionByName(name)
    }

    async getAll(empresaId: string) {
      return await permissionsDao.getAllPermissions(empresaId);
    }

    async updatePermissionById(id: string, permissionFields: PermissionsModel.registerPermission) {
      return await permissionsDao.updatePermissionById(id, permissionFields);
    }

    async deletePermissionById(id: string) {
      return await permissionsDao.deletePermissionById(id);
    }

}

export default new PermissionsService();
