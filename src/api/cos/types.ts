import pubsub from 'pubsub-js'
import UploadDB from '../../database/UploadDB'
export type CosProvider = 'tencent'


export type PutObjectParam = {
  signature: string
  path: string
  file: File
  /**
   * 存储桶地址
   */
  bucket: string
  // 上传后的文件名称
  uploadFilename: string
}

export type Mission = {
  // 上传后的文件名
  filename: string
  // 本地绝对路径
  absolutePath: string
  name: string
  abortControl: InstanceType<typeof AbortController>
  remoteUrl: string
  /**
   * 进度上传, 该方法应该在上传时随时检查是否非空，若非空则应该直接调用
   *
   * 在创建任务时不要为该属性赋值，该属性会在外部进行赋值，类似于创建了一个回调
   */
  onProgress?: (current: number, total: number) => void
  /**
   * 同{@link Mission#onProgress}, 在上传结束时应检查非空并且调用
   * @param response
   */
  onUploadDone?: (success: boolean, response: string) => void
}

export abstract class CloudObjectStorage {
  public static readonly PUBSUB_MISSION_ADD = 'COS_PUBSUB_KEY:missionAdd'

  public static readonly PUBSUB_MISSION_DONE = 'COS_PUBSUB_KEY:missionDone'

  /**
   * put object
   * @param param 请求参数
   */
  abstract putObject(param: PutObjectParam): Promise<void>

  protected pushMission(param: Mission) {
    pubsub.publish(CloudObjectStorage.PUBSUB_MISSION_ADD, param)
  }

  protected notifyMissionDone(mission: Mission, success?: boolean) {
    if (success) {
      UploadDB.saveUploadRecord(mission.absolutePath, mission.remoteUrl).catch(e => {
        console.error('保存上传记录失败', e, mission)
      })
    }
    pubsub.publish(CloudObjectStorage.PUBSUB_MISSION_DONE, mission)
  }


}


export type Secret = {
  secretKey: string
  secretId: string
}

/**
 * 对象存储签名工具
 */
export interface CosSigner {
  /**
   * 为文件上传签名
   * @param path 要上传的路径，需要具体到文件名，如<code>/test/hello.png</code>
   * @param secret 密匙
   */
  signPutRequest(path: string, secret: Secret): string
}
