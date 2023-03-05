export type CosProvider = 'tencent'


export type PutObjectParam = {
  signature: string
  /**
   * 上传到桶哪个位置
   *
   * 如'/image/hello.png'
   */
  path: string
  file: File
  /**
   * 存储桶地址
   */
  bucket: string
  // 上传后的文件名称
  uploadFilename: string
  /**
   * cdn访问地址
   */
  cdnUrl?: string
}

type OnProgress = (current: number, total: number) => void
type MissionResponse<Extra = void> = {
  /**
   * 任务成功之后返回的内容. <b>内容可能是html富文本</b>
   */
  message: string
  /**
   * 额外内容
   */
  extra?: Extra
}

export enum MissionType {
  PUT_OBJECT
}

export interface Mission<Extra = void> {
  /**
   * 上传后的文件名
   */
  filename: string
  /**
   * 本地绝对路径
   */
  absolutePath: string
  /**
   * 文件名称
   */
  name: string
  /**
   * 远程服务器url
   */
  remoteUrl: string
  /**
   * 执行当前任务
   * @param onProgress 执行进度回调
   * @return {Promise<string>} 任务成功之后返回的内容. <b>内容可能是html富文本</b>
   */
  execute: (onProgress?: OnProgress) => Promise<MissionResponse<Extra>>
  /**
   * @see Mission#execute
   */
  retry: (onProgress: OnProgress) => Promise<MissionResponse<Extra>>
  /**
   * 任务标识
   */
  type: MissionType
  /**
   * 取消当前任务
   */
  cancel: () => void
}

export abstract class CloudObjectStorage {

  /**
   * put object
   * @param param 请求参数
   * @return {Mission} 额外内容将返回文件访问路径
   */
  abstract putObject(param: PutObjectParam): Mission<string>

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
