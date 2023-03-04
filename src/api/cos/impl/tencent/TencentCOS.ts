import { CloudObjectStorage, Mission, PutObjectParam } from '../../types'
import axios from 'axios'
import { readFileUrl } from '../../../../utils/FileUtils'

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

  putObject(param: PutObjectParam): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const controller = new AbortController()
      const reader = new FileReader()
      const url = readFileUrl(param.file)
      reader.readAsArrayBuffer(param.file)
      const remoteUrl = appendUrl(param.bucket, param.path)
      reader.onload = () => {
        // do upload
        const mission: Mission = {
          absolutePath: url,
          name: param.file.name,
          abortControl: controller,
          filename: param.uploadFilename,
          remoteUrl
        }
        axios.put(remoteUrl, reader.result, {
          headers: {
            'Content-Type': param.file.type,
            'Authorization': param.signature
          },
          onUploadProgress: (evt) => {
            mission.onProgress?.(evt.progress ?? 0, evt.total ?? param.file.size)
          },
          signal: controller.signal
        }).then(r => {
          mission.onUploadDone?.(true, r.data)
          this.notifyMissionDone(mission, true)
        }).catch(e => {
          let data
          if (e.response && e.response.data) {
            data = e.response.data
          } else {
            data = e.message
          }
          mission.onUploadDone?.(false, data)
          this.notifyMissionDone(mission, false)
          resolve(e)
        })
        this.pushMission(mission)
      }
      reader.onerror = (e) => {
        console.error(e)
        reject(new Error('文件读取失败'))
      }
    })
  }

}
