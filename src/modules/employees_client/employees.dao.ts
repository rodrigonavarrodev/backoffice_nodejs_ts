import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:employees-dao");

export interface Employee extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  sector: string;
  phone: string;
  role: string;
  empresaId: string;
  boRole: string;
  passwordHash: string;
}

class EmployeesDao {
  Schema = mongooseService.getMongoose().Schema;

  employeesSchema = new this.Schema(
    {
      firstname: String,
      lastname: String,
      email: String,
      sector: String,
      phone: String,
      role: { type: Schema.Types.ObjectId, ref: "Permissions" }, // no es un arreglo
      empresaId: { type: Schema.Types.ObjectId, ref: "Organizations" }, // no es un arreglo
      boRole: { type: String, default: "Client" },
      passwordHash: String,
    },
    { timestamps: true }
  );

  Employee = mongooseService
    .getMongoose()
    .model<Employee>("Employees", this.employeesSchema);

  constructor() {
    log("Created new instance of EmployeeDao");
  }

  async addEmployee(
    employeesFields: employeesModel.registerEmployee,
    passwordHash: string,
    empresaId: string
  ) {
    const employee = new this.Employee({
      ...employeesFields,
      passwordHash: passwordHash,
      empresaId: empresaId
    });
    await employee.save();
    return employee;
  }

  async updateById(
    id: string,
    accountsFields: accountsAdminModel.updateUser
  ) {
    const account = await this.Employee.findOneAndUpdate(
      { _id: id },
      { $set: accountsFields },
      { new: true }
    ).exec();

    return account;
  }

  async getById(id: string) {
    return this.Employee.findOne({ _id: id }).exec();
  }

  async deleteById(id: string) {
    return this.Employee.deleteOne({ _id: id }).exec();
  }

  async getEmployeeById(userId: string, empresaId: string) {
    return this.Employee.findOne( {$and: [{ _id: userId }, { empresaId: empresaId }]} )
      .populate("empresaId")
      .populate({
        path: "role",
        populate: {
          path: "services",
        },
      })
      .exec();
  }

  async getEmployeeByEmail(email: string) {
    console.log(email);
    
    return this.Employee.findOne({ email: email })
      .populate("empresaId")
      .populate({
        path: "role",
        populate: {
          path: "services",
          populate: {
            path: "idApi"
          }
        }, 
      })
      .exec();
  }

  async getAllEmployees(empresaId: string) {
    return this.Employee.find({ empresaId: empresaId }).exec();
  }
  
}

export default new EmployeesDao();
