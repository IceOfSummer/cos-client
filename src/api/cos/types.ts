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

type OnProgress = (current: number, total: number) => void

export interface Mission<R = string> {
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
   */
  execute: (onProgress?: OnProgress) => Promise<R>
  /**
   * 重试当前任务
   * @param onProgress onProgress 执行进度回调
   */
  retry: (onProgress: OnProgress) => Promise<R>
  /**
   * 取消当前任务
   */
  cancel: () => void
  /**
   * 任务标记
   */
  meta?: string
}

export abstract class CloudObjectStorage {

  /**
   * put object
   * @param param 请求参数
   */
  abstract putObject(param: PutObjectParam): Mission

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
