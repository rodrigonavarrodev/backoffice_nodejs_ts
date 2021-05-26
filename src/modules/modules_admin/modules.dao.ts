import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:blanks-dao");

export interface Module extends mongoose.Document {
  name: string;
  services: any;
}

class ModulesDao {
  Schema = mongooseService.getMongoose().Schema;

  modulesSchema = new this.Schema(
    {
      name: String,
      services: [{ type: Schema.Types.ObjectId, ref: "Endpoints" }],
    },
    { timestamps: true }
  );

  Module = mongooseService
    .getMongoose()
    .model<Module>("Modules", this.modulesSchema);

  constructor() {
    log("Created new instance of StatesDao");
  }

  async addModule(moduleFields: ModulesModel.registerModule) {
    const module = new this.Module({ ...moduleFields });
    await module.save();
    return module;
  }

  async getModuleByName(name: string) {
    return this.Module.findOne({ name: name }).exec();
  }

  async getModuleById(id: string) {
    return this.Module.findOne({ _id: id }).populate({
      path: "services",
      populate: {
        path: "idApi",
      },
    });
  }

  async deleteModuleById(id: string) {
    return this.Module.deleteOne({ _id: id }).exec();
  }

  async updateModuleById(
    id: string,
    moduleFields: ModulesModel.registerModule
  ) {
    const module = await this.Module.findOneAndUpdate(
      { _id: id },
      { $set: moduleFields },
      { new: true }
    ).exec();

    return module;
  }

  async getAllModules() {
    return this.Module.find().populate({
      path: "services",
      populate: {
        path: "idApi",
      },
    });
  }
}

export default new ModulesDao();
