import { CosSigner, Secret } from '../../types'
import cosAuth from './cos-auth'

export default class TencentCosSigner implements CosSigner {

  private static _INSTANCE:TencentCosSigner | undefined


  signPutRequest(path: string, secret: Secret): string {
    if (path.charAt(0) !== '/') {
      path = '/' + path
    }
    return cosAuth({ Method: 'put', Pathname: path, SecretId: secret.secretId, SecretKey: secret.secretKey })
  }

  static get INSTANCE(): TencentCosSigner {
    if (this._INSTANCE) {
      return this._INSTANCE
    }
    return this._INSTANCE = new TencentCosSigner()
  }
}
