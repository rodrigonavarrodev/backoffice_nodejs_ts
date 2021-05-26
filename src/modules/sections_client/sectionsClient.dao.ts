import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:endpoint-dao");

export interface SectionClient extends mongoose.Document {
  name: string;
  url: string;
}

class SectionsDao {
  Schema = mongooseService.getMongoose().Schema;

  sectionsClientSchema = new this.Schema(
    {
      name: String,
      url: String,
    },
    { timestamps: true }
  );

  Section = mongooseService
    .getMongoose()
    .model<SectionClient>("Sectionsclient", this.sectionsClientSchema);

  constructor() {
    log("Created new instance of EndpointDao");
  }

  async addSection(sectionFields: SectionsModel.registerSection) {
    const section = new this.Section({ ...sectionFields });
    await section.save();
    return section;
  }

  async getAllSections() {
    return this.Section.find({}).exec();
  }

  async deleteSectionById(id: string) {
    return this.Section.deleteOne({ _id: id }).exec();
  }

  async updateSectionById(
    id: string,
    sectionFields: SectionsModel.registerSection
  ) {
    const section = await this.Section.findOneAndUpdate(
      { _id: id },
      { $set: sectionFields },
      { new: true }
    ).exec();

    return section;
  }
}

export default new SectionsDao();
