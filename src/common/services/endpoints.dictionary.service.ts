import axios, { AxiosResponse } from "axios";

class ImageService {
  public getCoinImage(services: any): String {
    const dictionary: any = {
      BOregistrarUsuario: "/adminbo/registrarusuario",
      BOautenticarse: "/adminbo/autenticarse",
    };

    return dictionary[services];
  }
}

export default new ImageService();
