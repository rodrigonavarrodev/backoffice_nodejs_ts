import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:endpoint-dao");

export interface Endpoint extends mongoose.Document {
  name: string;
  idApi: string;
  method: string;
  category: string;
}

class EndpointsDao {
  Schema = mongooseService.getMongoose().Schema;

  endpointsSchema = new this.Schema(
    {
      name: String,
      idApi: { type: Schema.Types.ObjectId, ref: "Apis" }, // no es un arreglo
      method: String,
      category: String
    },
    { timestamps: true }
  );

  Endpoint = mongooseService
    .getMongoose()
    .model<Endpoint>("Endpoints", this.endpointsSchema);

  constructor() {
    log("Created new instance of EndpointDao");
  }

  async addEndpoint(endpointFields: EndpointsModel.registerEndpoint) {
    const endpoint = new this.Endpoint({ ...endpointFields });
    await endpoint.save();
    return endpoint;
  }

  async getEndpointById(id: string) {
    return this.Endpoint.findOne({ _id: id }).populate("idApi");
  }

  async getAllEndpoints() {
    return this.Endpoint.find().populate("idApi").exec()
  }
}

export default new EndpointsDao();
