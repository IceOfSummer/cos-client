
export type CosProvider = 'tencent'


export type PutObjectParam = {
  signature: string
  path: string
  file: File
  progressCallback?: (current: number, total: number) => void
  /**
   * 存储桶地址
   */
  bucket: string
}

export interface CloudObjectStorage {
  /**
   * put object
   * @param param 请求参数
   * @return {string} 请求的响应
   */
  putObject(param: PutObjectParam): Promise<string>
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
