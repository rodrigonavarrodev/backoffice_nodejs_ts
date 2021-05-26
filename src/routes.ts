import {CommonRoutesConfig} from './common/common.routes.config'
import {AccountAdminRoutes} from './modules/accounts_admin/accounts_admin.routes.config'
import {OrganizationRoutes} from './modules/organizations_admin/organizations.routes.config'
import { ModulesRoutes } from './modules/modules_admin/modules.routes.config';
import{ EndpointRoutes } from './modules/endpoints/endpoints.routes.config'
import { ApiRoutes } from './modules/apis/apis.routes.config'
import { EmployeesRoutes } from './modules/employees_client/employees.routes.config';
import { PermissionsRoutes } from './modules/permissions_client/permissions.routes.config';
import {MobileAppRoutes} from './modules/mobile_app/mobileapp.routes.config';

import{ MenuAdminRoutes} from './modules/menu_admin/menuAdmin.routes.config';
import{ SectionsAdminRoutes} from './modules/sections_admin/sectionsAdmin.routes.config';
import{ SectionsClientRoutes} from './modules/sections_client/sectionsClient.routes.config';

import{ MenuClientRoutes} from './modules/menu_client/menuClient.routes.config';
import debug from 'debug';
import { format } from 'morgan';

const debugLog: debug.IDebugger = debug('app:routes');

export default class Router {
    public static init(app: any): any {
        debugLog('Router - Start adding routes.');
        const routes: Array<CommonRoutesConfig> = [];

        routes.push(new PermissionsRoutes(app));
        routes.push(new EmployeesRoutes(app));
        routes.push(new ApiRoutes(app));
        routes.push(new EndpointRoutes(app));
        routes.push(new ModulesRoutes(app));
        routes.push(new OrganizationRoutes(app));
        routes.push(new AccountAdminRoutes(app));
        routes.push(new MobileAppRoutes(app));
        
        routes.push(new MenuAdminRoutes(app));
        routes.push(new SectionsAdminRoutes(app));
        routes.push(new SectionsClientRoutes(app));
        routes.push(new MenuClientRoutes(app));
        routes.forEach((route: CommonRoutesConfig) => {
            debugLog(`Routes configured for ${route.getName()}`);
        });
    
        return routes;
    }
}
