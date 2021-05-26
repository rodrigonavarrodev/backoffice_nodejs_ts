import AccountsAdminDao from "./accounts_admin.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import randomTokenString from "crypto-random-string";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import debug from "debug";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from "@azure/storage-blob";
import { config as dotenv } from "dotenv";
dotenv();
import getStream from "into-stream";

const log: debug.IDebugger = debug("app:accountsAdmin-service");

class AccountsAdminService implements CRUD {
  async create(resource: any) {
    console.log("test");
  }

  async registerUser(resource: accountsAdminModel.registerUser) {
    const account = await AccountsAdminDao.getAccountByEmail(resource.email);
    if (account) throw { msg: "El correo que ingreso ya existe, elija otro." };

    //Hashear password
    const passwordHash = this.hash(resource.password);

    return AccountsAdminDao.addAccount(resource, passwordHash);
  }

  hash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  generateJwtToken(parameters: any) {
    return jwt.sign(
      {
        userId: parameters.id,
      },
      config.secret,
      {
        expiresIn: "15m",
      }
    );
  }

  async getAccountByEmail(email: string) {
    return AccountsAdminDao.getAccountByEmail(email);
  }

  async getOne(userId: string) {
    const account = await AccountsAdminDao.getAccountById(userId);
    if (account) {
      return { ...this.accountDetails(account) };
    } else {
      return null;
    }
  }

  async getAccountById(id: string) {
    const account = await AccountsAdminDao.getAccountById(id);
    if (account) {
      return { ...this.accountDetails(account) };
    } else {
      return null;
    }
  }

  async authenticateUser(resource: accountsAdminModel.authenticateUser) {
    let account = await AccountsAdminDao.getAccountByEmail(resource.email);
    if (!account) throw { msg: "El correo ingresado no esta registrado" };
    if (!bcrypt.compareSync(resource.password, account.passwordHash)) {
      throw { msg: "La contraseña ingresada es incorrecta" };
    }

    const jwtToken = this.generateJwtToken(account);
    return { ...this.accountDetails(account), jwtToken };
  }

  accountDetails(account: any) {
    const { id, email, name, profilePic, role, boRole } = account;
    return {
      id,
      email,
      name,
      profilePic,
      role,
      boRole,
    };
  }

  async deleteAccountById(id: string) {
    const accountDeleted = await AccountsAdminDao.deleteAccountById(id);
    return { accountDeleted };
  }

  async updateById(resource: accountsAdminModel.updateUser, id: string) {
    const account = await AccountsAdminDao.updateAccountById(id, resource);
    return { ...this.accountDetails(account) };
  }

  async getAll() {
    return await AccountsAdminDao.getAllAccounts();
  }

  async uploadProfileImage(filesArray: any, userId: string) {
    //Azure
    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME!,
      process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!
    );
    const pipeline = newPipeline(sharedKeyCredential);

    const blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      pipeline
    );
    const containerName2 = "profilepics";
    const containerClient =
      blobServiceClient.getContainerClient(containerName2);
    //

    const blobNameVar = filesArray[0].originalname;
    const streamVar = filesArray[0].buffer;
    const blobName = this.getBlobName(blobNameVar);
    const stream = getStream(streamVar);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const ONE_MEGABYTE = 1024 * 1024;
    const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

    await blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpeg" } }
    );

    const account = await AccountsAdminDao.setAccountFieldById(userId, {
      profilePic: blobName,
    });

    return account;
  }

  async getProfileImage(userId: string) {
    const account = await AccountsAdminDao.getAccountById(userId);
    if (account) {
      const response = { image: process.env.profilePICurl+this.accountProfilePic(account).profilePic}
      return response;
    } else {
      return null;
    }
  }

  async deleteProfileImage(userId: string) {
    return AccountsAdminDao.unsetAccountFieldById(userId, {
        profilePic: 1,
      });
  }

  getBlobName(originalName: any) {
    const identifier = Math.random().toString().replace(/0\./, "");
    return `${identifier}-${originalName}`;
  }

  accountProfilePic(account: any) {
    const {
        profilePic
    } = account;
    return {
        profilePic
    };
  }

}

export default new AccountsAdminService();
