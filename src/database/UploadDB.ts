import Database, { TABLE_UPLOAD } from './index'

export type UploadDBSchema = {
  path: string
  remoteUrl: string
}

export default class UploadDB {

  public static checkIsUploaded(path: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = Database.INSTANCE.connection.transaction([TABLE_UPLOAD.tableName], 'readonly')
      const objStore = transaction.objectStore(TABLE_UPLOAD.tableName)
      const req = objStore.get(path)
      req.onerror = (e) => {
        reject(e)
      }
      req.onsuccess = (evt) => {
        console.log(evt)
        // @see https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB#%E4%BB%8E%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B8%AD%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = evt.target.result as UploadDBSchema
        if (result) {
          resolve(result.remoteUrl)
        } else {
          resolve(undefined)
        }
      }
    })
  }

  public static saveUploadRecord(path: string, remoteUrl: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = Database.INSTANCE.connection.transaction([TABLE_UPLOAD.tableName], 'readwrite')
      const objStore = transaction.objectStore(TABLE_UPLOAD.tableName)
      const data: UploadDBSchema = {
        path,
        remoteUrl
      }
      const req = objStore.add(data)
      req.onsuccess = () => {
        resolve(remoteUrl)
      }
      req.onerror = (e) => {
        reject(e)
      }
    })
  }

  /**
   * 分页查询
   * @see https://www.jianshu.com/p/849924a1481c
   */
  public static queryUploadedByPage(page: number, size = 8): Promise<UploadDBSchema[]> {
    return new Promise((resolve, reject) => {
      const transaction = Database.INSTANCE.connection.transaction([TABLE_UPLOAD.tableName], 'readonly')
      const objStore = transaction.objectStore(TABLE_UPLOAD.tableName)
      const req = objStore.openCursor()
      req.onerror = e => {
        reject(e)
      }
      let index: number | null = null
      const data: UploadDBSchema[] = []
      req.onsuccess = evt => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = evt.target.result
        if (result) {
          if (index === size - 1) {
            data.push(result.value)
            resolve(data)
            return
          } else if (index === null && page !== 1) {
            index = 0
            result.advance((page - 1) * size)
          } else {
            index = index ? index + 1 : 1
            data.push(result.value)
            result.continue()
          }
        } else {
          resolve(data)
        }
      }
    })
  }

  public static getUploadedCount():Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = Database.INSTANCE.connection.transaction([TABLE_UPLOAD.tableName], 'readonly')
      const objStore = transaction.objectStore(TABLE_UPLOAD.tableName)
      const cntQuery = objStore.count()
      cntQuery.onsuccess = evt => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve(evt.target.result)
      }
      cntQuery.onerror = e => {
        reject(e)
      }
    })
  }


}
