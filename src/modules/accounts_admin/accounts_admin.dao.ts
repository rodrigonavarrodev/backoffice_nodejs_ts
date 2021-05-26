import mongooseService from "../../common/services/mongoose.service";
import mongoose from "mongoose";
import debug from "debug";
const Schema = mongoose.Schema;

const log: debug.IDebugger = debug("app:accountsAdmin-dao");

export interface AccountAdmin extends mongoose.Document {
  name: string;
  email: string;
  title: string;
  role: string;
  boRole: string;
  passwordHash: string;
  profilePic: string;
}

class AccountsAdminDao {
  Schema = mongooseService.getMongoose().Schema;

  accountsAdminSchema = new this.Schema(
    {
      name: String,
      email: String,
      title: String,
      role: { type: String, enum: ["Admin", "User"] },
      boRole: { type: String, default: "Admin" },
      passwordHash: String,
      profilePic: String
    },
    { timestamps: true }
  );

  AccountAdmin = mongooseService
    .getMongoose()
    .model<AccountAdmin>("AccountsAdmin", this.accountsAdminSchema);

  constructor() {
    log("Created new instance of AccountsAdminDao");
  }

  async getAccountByEmail(email: string) {
    return this.AccountAdmin.findOne({ email: email }).exec();
  }

  async addAccount(
    accountFields: accountsAdminModel.registerUser,
    passwordHash: string
  ) {
    const account = new this.AccountAdmin({
      ...accountFields,
      passwordHash: passwordHash,
    });
    await account.save();
    return account;
  }

  async getAllAccounts() {
    return this.AccountAdmin.find().exec();
  }

  async getAccountById(id: string) {
    return this.AccountAdmin.findOne({ _id: id }).exec();
  }

  async deleteAccountById(id: string) {
    return this.AccountAdmin.deleteOne({ _id: id }).exec();
  }

  async deleteAccountByEmail(email: string) {
    return this.AccountAdmin.deleteOne({ email: email }).exec();
  }

  async getAccountByResetToken(resetToken: string) {
    return this.AccountAdmin.findOne({ "resetToken.token": resetToken }).exec();
  }

  async updateAccountById(
    id: string,
    accountsFields: accountsAdminModel.updateUser
  ) {
    const account = await this.AccountAdmin.findOneAndUpdate(
      { _id: id },
      { $set: accountsFields },
      { new: true }
    ).exec();

    return account;
  }

  async unsetAccountFieldById(
    id: string,
    accountsFields: any
) {
    const account = await this.AccountAdmin.updateOne ( 
        { _id: id },
        { $unset: accountsFields}
    ).exec();

    return account;
}

  async setAccountFieldById(
    id: string,
    accountsFields: any
) {
    await this.AccountAdmin.updateOne(
        { _id: id },
        { $set: accountsFields}
    ).exec();
    
    return this.AccountAdmin.findOne({ _id: id });
}


}

export default new AccountsAdminDao();
