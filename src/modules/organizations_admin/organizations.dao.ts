import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:organizations-dao");

export interface Organization extends mongoose.Document {
  razonSocial: string;
  cuit: string;
  psp: string;
  telefono: string;
  email: string;
  instancias: any;
  modulos: any;
  role: any;
  boRole: string;
}

class OrganizationsDao {
  Schema = mongooseService.getMongoose().Schema;

  organizationsSchema = new this.Schema(
    {
      razonSocial: String,
      cuit: String,
      psp: String,
      telefono: String,
      email: String,
      instancias: Array,
      modulos: [{ type: Schema.Types.ObjectId, ref: "Modules" }]
    },
    { timestamps: true }
  );

  Organization = mongooseService
    .getMongoose()
    .model<Organization>("Organizations", this.organizationsSchema);

  constructor() {
    log("Created new instance of OrganizationDao");
  }

  async getAccountByCuit(cuit: string) {
    return this.Organization.findOne({ cuit: cuit }).exec();
  }

  async getAccountByEmail(email: string) {
    return this.Organization.findOne({ email: email }).exec();
  }

  async addOrganization(
    organizationFields: organizationsModel.registerOrganization,
  ) {
    const account = new this.Organization({
      ...organizationFields
    });
    await account.save();
    return account;
  }

  async getAccountById(id: string) {
    //return this.Organization.findOne({ _id: id }).populate('modulos');
    return this.Organization.findOne({ _id: id })
      .populate({
        path: "modulos",
        populate: {
          path: "services",
          populate: {
            path: "idApi",
          },
        },
      })
      .exec();
  }

  async deleteOrganizationById(id: string) {
    return this.Organization.deleteOne({ _id: id }).exec();
  }

  async updateOrganizationById(
    id: string,
    organizationFields: organizationsModel.registerOrganization ) {
    const organization = await this.Organization.findOneAndUpdate(
      { _id: id },
      { $set: organizationFields },
      { new: true }
    ).exec();

    return organization;
  }

  async getAll() {
    return this.Organization.find().populate({
      path: "modulos",
      populate: {
        path: "services",
        populate: {
          path: "idApi",
        },
      },
    })
    .exec();
  }

}

export default new OrganizationsDao();
