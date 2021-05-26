import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;


const log: debug.IDebugger = debug("app:apis-dao");

export interface Api extends mongoose.Document {
  name: string;
}

class ApisDao {
  Schema = mongooseService.getMongoose().Schema;

  apisSchema = new this.Schema(
    {
      name: String,
    },
    { timestamps: true }
  );

  Api = mongooseService
    .getMongoose()
    .model<Api>("Apis", this.apisSchema);

  constructor() {
    log("Created new instance of ApisDao");
  }

  async getAll() {
    return this.Api.find()
  }
  
}

export default new ApisDao();
