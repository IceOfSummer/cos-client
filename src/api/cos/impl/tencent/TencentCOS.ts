import { CloudObjectStorage, PutObjectParam } from '../../types'
import axios from 'axios'

export default class TencentCOS implements CloudObjectStorage {

  private static _INSTANCE: TencentCOS | undefined


  static get INSTANCE(): TencentCOS {
    if (this._INSTANCE) {
      return this._INSTANCE
    }
    return this._INSTANCE = new TencentCOS()
  }

  putObject(param: PutObjectParam): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(param.file)
      reader.onload = () => {
        // do upload
        resolve(
          axios.put(param.bucket + param.path, reader.result, {
            headers: {
              'Content-Type': param.file.type,
              'Authorization': param.signature
            },
            onUploadProgress: (evt) => {
              param.progressCallback?.(evt.progress ?? 0, evt.total ?? param.file.size)
            }
          })
        )
      }
      reader.onerror = (e) => {
        console.error(e)
        reject(new Error('文件读取失败'))
      }
    })
  }

}
