import { CRUD } from "../../common/interfaces/crud.interface";
import debug from "debug";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import EmployeesDao from "./employees.dao";

const log: debug.IDebugger = debug("app:blanks-service");

class EmployeesService implements CRUD {
  async create() {
    return "";
  }

  async registerEmployee(resource: employeesModel.registerEmployee, empresaId: string) {
    const password = "123456"
    const passwordHash = this.hash(password);
    return EmployeesDao.addEmployee(resource, passwordHash, empresaId);
  }

  hash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  generateJwtToken(parameters: any) {
    return jwt.sign(
      {
        userId: parameters.id,
        roleId: parameters.role._id,
        empresaId: parameters.empresaId._id
      },
      config.secret,
      {
        expiresIn: "15m",
      }
    );
  }

  async getEmployeeById(userId: string, empresaId: string) {
    const employee = await EmployeesDao.getEmployeeById(userId, empresaId);
    if (employee) {
      return { ...this.employeeDetails(employee) };
    } else {
      return null;
    }
  }

  async authenticateEmployee(resource: accountsAdminModel.authenticateUser) {
    let employee = await EmployeesDao.getEmployeeByEmail(resource.email);
    if (!employee) throw { msg: "El correo ingresado no esta registrado" };
    if (!bcrypt.compareSync(resource.password, employee.passwordHash)) {
      throw { msg: "La contraseña ingresada es incorrecta" };
    }

    const jwtToken = this.generateJwtToken(employee);
    return { ...this.employeeDetails(employee), jwtToken };
  }
  
  async updateById(resource: accountsAdminModel.updateUser, id: string) {
    const account = await EmployeesDao.updateById(id, resource);
    return { ...this.employeeDetails(account) };
  }

  async getById(id: string) {
    const account = await EmployeesDao.getById(id);
    if (account) {
      return { ...this.employeeDetails(account) };
    } else {
      return null;
    }
  }

  async deleteById(id: string) {
    const accountDeleted = await EmployeesDao.deleteById(id);
    return { accountDeleted };
  }

  async getAll(empresaId: string) {
    return await EmployeesDao.getAllEmployees(empresaId);
  }

  employeeDetails(employee: any) {
    const {
      _id,
      firstname,
      lastname,
      email,
      sector,
      phone,
      role,
      empresaId,
      boRole,
    } = employee;
    return {
      _id,
      firstname,
      lastname,
      email,
      sector,
      phone,
      role,
      empresaId,
      boRole,
    };
  }

  async getEmployeeByEmail(email: string) {
    return EmployeesDao.getEmployeeByEmail(email);
  }

}

export default new EmployeesService();
