import {createClient} from 'async-redis'

import debug from 'debug';

const log: debug.IDebugger = debug('app:redis-service');

class RedisService {
    private port = process.env.REDIS_PORT;
    private host = process.env.REDIS_HOST;
    public client:any;

    constructor() {
        this.client = createClient(Number(this.port), this.host, {
            retry_strategy: function(options) {
              // tries to reconnect on connection lost 5 times every 5 seconds
              console.log('Trying to reconnect Redis.');
              return 5000;
            }});

        this.client.on("connect", () => {
            console.log("Redis Connected");
        });

    }

    public async setJSONData(key: any, value: any){
        return await this.client.set(key, JSON.stringify(value));
    }

    public async getJSONData(key: any){
        console.log(this.client.connected);
        if (this.client.connected) {
            const crudData = await this.client.get(key);
            return JSON.parse(crudData);
        } else {
            throw new Error('Servicio de Redis caído.');
        }
    }

    public async delByKey(key: any){
        return await this.client.del(key);
    }

    public async checkRedisConnection(){
        return await this.client.connected;
    }


}

export default new RedisService();

