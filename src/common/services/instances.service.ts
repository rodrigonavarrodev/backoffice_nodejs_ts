import debug from "debug"
import axios from "axios"

const log: debug.IDebugger = debug("app:instances-service");

class InstanceService {

  constructor() {}

  async loginBind(url: string, username: string, password: string) {
    try {
      let login = await axios({
        method: "post",
        url: url,
        data: {
          username: username,
          password: password,
        },
      });

      let token = login.data.token;
      return token;
    } catch (err) {
      console.log(err);
    }
  }

  public async loginBT(url: string, username: string, password: string): Promise<any> {
    let response = await axios({
        method: "get",
        url: url,
        data: {
          Btinreq: {
            Device: "AV",
            Usuario: "install.bantotalgo",
            Canal: "BTDIGITAL",
          },
          UserId: username,
          UserPassword: password,
        }
    })

    return response.data.SessionToken;
  }

  public async loginRedLink(url: string, username: string, password: string): Promise<any> {
    let response = await axios({
      method: "post",
      url: url,
      headers: {
        'x-ibm-client-id': username,
        'x-ibm-client-secret': password
      },
      data: {
        scope:"DEBIN, PAGOS"
      }
    });

    return response.data.access_token;
  }

}

export default new InstanceService();