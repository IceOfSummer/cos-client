import { CloudObjectStorage, Mission, PutObjectParam } from '../../types'
import axios from 'axios'
import { readFileAsBuffer, readFileUrl } from '../../../../utils/FileUtils'

const appendUrl = (host: string, path: string) => {
  if (path.charAt(0) === '/') {
    return host + path
  } else {
    return host + '/' + path
  }
}

export default class TencentCOS extends CloudObjectStorage {

  private static _INSTANCE: TencentCOS | undefined


  static get INSTANCE(): TencentCOS {
    if (this._INSTANCE) {
      return this._INSTANCE
    }
    return this._INSTANCE = new TencentCOS()
  }

  putObject(param: PutObjectParam): Mission {
    const url = readFileUrl(param.file)
    const remoteUrl = appendUrl(param.bucket, param.path)
    const controller = new AbortController()
    const mission: Mission = {
      absolutePath: url,
      name: param.file.name,
      remoteUrl,
      filename: param.uploadFilename,
      execute: (cb) => new Promise( async (resolve, reject) => {
        const data = await readFileAsBuffer(param.file)
        axios.put(remoteUrl, data, {
          headers: {
            'Content-Type': param.file.type,
            'Authorization': param.signature
          },
          onUploadProgress: (evt) => {
            cb?.(evt.loaded ?? 0, evt.total ?? param.file.size)
          },
          signal: controller.signal
        }).then(r => {
          resolve(r.data)
        }).catch(e => {
          let error
          if (e.response && e.response.data) {
            error = new Error(e.response.data)
          } else {
            error = e
          }
          reject(error)
        })
      }),
      retry: (cb) => {
        return mission.execute(cb)
      },
      cancel: () => {
        controller.abort()
      }
    }
    return mission
  }

}
