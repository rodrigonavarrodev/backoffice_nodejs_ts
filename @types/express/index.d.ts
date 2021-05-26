import { jwtModel } from '../../src/common/types/jwt'

declare global{
    namespace Express {
        interface Request {
            jwt: jwtModel;
            files: any;
        }
    }
}