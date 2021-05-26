import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import OrganizationsDao from "./organizations.dao";
import bcrypt from "bcrypt";
import PermissionsService from "../permissions_client/permissions.service";
import ModulesService from "../modules_admin/modules.service";
import EmployeesService from "../employees_client/employees.service";
import InstanceService from '../../common/services/instances.service'
import EndpointsService from '../endpoints/endpoints.service'
import ApisService from '../apis/apis.service'
import MobileAppService from '../mobile_app/mobileapp.service'

const log: debug.IDebugger = debug("app:blanks-service");

class OrganizationsService implements CRUD {
  async create() {
    return "";
  }

  async registerOrganization(
    resource: organizationsModel.registerOrganization
  ) {
    //registrar organizacion
    const organization = await OrganizationsDao.addOrganization(resource);

    //Extraigo los servicos de los modulos contratados
    const services = await this.extractServicesFromModules(resource.modulos);

    //extraigo las apis de los servicios y creo la coleccion mobile_app
    const apis = await this.extractAPIs(services);
    await MobileAppService.create({empresaId: organization._id, services: apis});
    //creo el rol con todos los permisos para el empleado Cero
    const permission = {
      name: "SuperAdmin " + resource.razonSocial,
      services: services,
    };
    
    const createPermission = await this.registerPermissionCero(permission, organization._id);

    //creo el usuario 0 en employees en cliente
    const employeeCero = {
      firstname: resource.razonSocial,
      email: resource.email,
      phone: resource.telefono,
      role: createPermission._id,
      boRole: "Client",
    };

    await this.registerEmployeeCero(employeeCero, organization._id);

    return organization;
  }

  async registerEmployeeCero(resource: any, empresaId: string) {
    return EmployeesService.registerEmployee(resource, empresaId);
  }

  async registerPermissionCero(resource: any, empresaId: string) {
    return PermissionsService.registerPermission(resource, empresaId);
  }

  async extractServicesFromModules(resource: any) {
    const services: any = [];
    //Itera todos los modulos que se le asignan a la organizacion y devuelve los servicios que incluye cada modulo
    for (let i = 0; i < resource.length; i++) {
      const result = await ModulesService.getModuleById(resource[i]);
      result?.services.map((x: any) => {
        services.push(x._id);
      });
    }
    return services;
  }

  async extractAPIs(services: any) {
    let apisArray = [];
    for (let i = 0; i < services.length; i++) {
      const data = EndpointsService.endpointDetails(await EndpointsService.getEndpointById(services[i]._id));
      apisArray.push(data.idApi.name);
    }
    const unique = Array.from(new Set(apisArray));
    let apis = ApisService.getApiDetailsMapped(await ApisService.getAll());
    apis.forEach( (currentValue: any, index: any, array: any) => {
      if (unique.includes(currentValue.name)) {
        array[index].status = true;
      } else {
        array[index].status = false;
      }
      //por ahora no puede no incluir usuarios, ob y billetera
      if ((currentValue.name == 'Usuarios') || (currentValue.name == 'Onboarding') || (currentValue.name == 'Billetera')){
        array[index].status = true;
      }
    });

    apis = apis.map((item: { id: any; name: any; status: any; }) => {
      return {
        idApi: item.id,
        name: item.name,
        status: item.status,
      };
    });

    return apis;
  }

  hash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  async getAccountByCuit(cuit: string) {
    return OrganizationsDao.getAccountByCuit(cuit);
  }

  async getAccountByEmail(email: string) {
    return OrganizationsDao.getAccountByEmail(email);
  }

  async getAccountById(id: string) {
    const account = await OrganizationsDao.getAccountById(id);
    if (account) {
      return account;
    } else {
      return null;
    }
  }

  async deleteOrganizationById(id: string) {
    const organizationDeleted = await OrganizationsDao.deleteOrganizationById(
      id
    );
    await MobileAppService.deleteByEmpresaId(id);
    return { organizationDeleted };
  }

  async updateById(
    resource: organizationsModel.registerOrganization,
    id: string
  ) {
    const orgizationUpdated = await OrganizationsDao.updateOrganizationById(
      id,
      resource
    );
    //Extraigo los servicos de los modulos contratados
    const services = await this.extractServicesFromModules(resource.modulos);
    //extraigo las apis de los servicios y actualizo la coleccion mobile_app
    const apis = await this.extractAPIs(services);
    await MobileAppService.updateByEmpresaId(id, {services: apis});

    return { orgizationUpdated };
  }

  async checkInstance(url: string) {
    let instance:string;
    if (url.includes("bind")){
      instance = "bind";
    } else if (url.includes("bantotal")){
      instance = "bantotal";
    } else if (url.includes("redlink")){
      instance = "redlink";
    }
    else {
      return "Instancia no válida";
    }
    return instance;
  }

  async login(instance: string, url: string, username: string, password: string) {
    let token: string;
    if (instance == "bind"){
      token = await InstanceService.loginBind(url, username, password);
      return token;
    } else if (instance == "bantotal"){
      token = await InstanceService.loginBT(url, username, password);
      return token;
    } else if (instance == "redlink"){
      token = await InstanceService.loginRedLink(url, username, password);
      return token;
    }
  }

  async getAll() {
    return await OrganizationsDao.getAll();
  }

}

export default new OrganizationsService();
