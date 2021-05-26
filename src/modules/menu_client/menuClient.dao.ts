import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:endpoint-dao");

export interface MenuClient extends mongoose.Document {
  role: string;
  menu: any;
 
}

class MenuDao {
  Schema = mongooseService.getMongoose().Schema;

  menuClientSchema = new this.Schema(
    {
      role: String,
      menu: [{
          nombre: String,
          secciones: [{ type: Schema.Types.ObjectId, ref: "Sectionsclient" }],
          order: String,
        }]
    },
    { timestamps: true }
  );

  Menu = mongooseService
    .getMongoose()
    .model<MenuClient>("MenuClient", this.menuClientSchema);

  constructor() {
    log("Created new instance of EndpointDao");
  }

  async addMenu(menuFields: MenuClientModel.registerMenu) {
    const menu = new this.Menu({ ...menuFields });
    await menu.save();
    return menu;
  }
 
  async getMenusByRole(role: string) {
    return this.Menu.findOne({role: role}).populate({
      path: "menu",
      populate: {
        path: "menu submenu" 
      }
    });
  }


  async deletMenuById(id: string) {
    return this.Menu.deleteOne({ _id: id }).exec();
  }


  async updateMenuById(
    id: string,
    menuFields: MenuModel.registerMenu
  ) {
    const menu = await this.Menu.findOneAndUpdate(
      { _id: id },
      { $set: menuFields },
      { new: true }
    ).exec();

    return menu;
  }


}
export default new MenuDao();
