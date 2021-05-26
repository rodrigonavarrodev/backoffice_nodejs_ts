import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:permissions-dao");

export interface Permission extends mongoose.Document {
  name: string;
  empresaId: string;
  services: any;
}

class PermissionsDao {
  Schema = mongooseService.getMongoose().Schema;

  permissionsSchema = new this.Schema(
    {
      name: String,
      empresaId: {type: Schema.Types.ObjectId},
      services: [{ type: Schema.Types.ObjectId, ref: "Endpoints" }],
    },
    { timestamps: true }
  );

  Permission = mongooseService
    .getMongoose()
    .model<Permission>("Permissions", this.permissionsSchema);

  constructor() {
    log("Created new instance of PermissionsDao");
  }

  async addPermission(permissionFields: PermissionsModel.registerPermission, empresaId: string) {
    
    const permission = new this.Permission({ ...permissionFields, empresaId: empresaId});
    await permission.save();
    return permission;
  }

  async getPermissionById(id: string) {
    return this.Permission.findOne({ _id: id }).populate({
      path: "services",
      populate: {
        path: "idApi",
      },
    });
  }

  async getPermissionByName(name: string) {
    return this.Permission.findOne({name: name}).populate({
      path: "services",
      populate: {
        path: "idApi",
      },
    });
  }

  async getAllPermissions(empresaId: string) {
    return this.Permission.find( { empresaId: empresaId }).populate({
      path: "services",
      populate: {
        path: "idApi",
      },
    });
  }

  async updatePermissionById(id: string, permissionFields: PermissionsModel.registerPermission){
    const permissions = await this.Permission.findOneAndUpdate(
      { _id: id },
      { $set: permissionFields },
      { new: true }
      ).exec();

      return permissions;
    }

    async deletePermissionById(id: string) {
      return this.Permission.deleteOne({ _id: id }).exec();
    }

}

export default new PermissionsDao();
