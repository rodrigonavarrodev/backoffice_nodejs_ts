import mongooseService from '../../common/services/mongoose.service'
import mongoose from 'mongoose'
import debug from 'debug'

const Schema = mongoose.Schema;

const log: debug.IDebugger = debug('app:mobileApp-dao');

export interface MobileApp extends mongoose.Document {
    empresaId: string;
    services: any;
};

class MobileAppDao {
    Schema = mongooseService.getMongoose().Schema;

    mobileAppSchema = new this.Schema({
        empresaId: String,
        services: [{name: String, idApi: String, status: Boolean}]
    }, { timestamps: true });

    MobileApps = mongooseService.getMongoose().model<MobileApp>('Mobileapps', this.mobileAppSchema);

    constructor() {
        log('Created new instance of MobileAppDao');
    }

    async addMovileAppServices(mobileAppFields: mobileAppModel.create) {
        const mobileApp = new this.MobileApps({
          ...mobileAppFields
        });
        await mobileApp.save();
        return mobileApp;
    }

    async getByEmpresaId(empresaId: string) {
        return this.MobileApps.findOne({ empresaId });
    }

    async deleteByEmpresaId(empresaId: string) {
        return this.MobileApps.deleteOne({ empresaId });
    }

    async updateByEmpresaId(
        empresaId: string,
        resource: mobileAppModel.update
      ) {
        const mobileApp = await this.MobileApps.findOneAndUpdate(
          { empresaId },
          { $set: resource },
          { new: true }
        ).exec();
    
        return mobileApp;
      }


}

export default new MobileAppDao();