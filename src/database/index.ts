import pubsub from 'pubsub-js'

export const TABLE_UPLOAD = Object.freeze({
  tableName: 'upload',
  primaryKey: 'path'
})


export default class Database {

  public static readonly PUBSUB_ON_DB_INIT_DONE = 'Database:onDatabaseInitDone'

  private static _INSTANCE: Database | undefined

  static get INSTANCE(): Database {
    if (this._INSTANCE) {
      return this._INSTANCE
    }
    return this._INSTANCE = new Database()
  }

  private _connection: IDBDatabase | undefined

  constructor() {
    const database = indexedDB.open('cos-client')
    database.onerror = (e) => {
      console.error(e)
    }
    database.onupgradeneeded = (evt) => {
      // @see https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const db = evt.target.result as IDBDatabase
      const objectStore = db.createObjectStore(TABLE_UPLOAD.tableName, { keyPath: TABLE_UPLOAD.primaryKey })
      objectStore.createIndex('pathIndex', TABLE_UPLOAD.primaryKey, { unique: false })
      this._connection = db
      pubsub.publish(Database.PUBSUB_ON_DB_INIT_DONE)
      console.log('indexedDB init success')
    }
    database.onsuccess = (e) => {
      // @see https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._connection = e.target.result
      pubsub.publish(Database.PUBSUB_ON_DB_INIT_DONE)
      console.log('load indexedDB success')
    }

  }

  get connection(): IDBDatabase {
    if (!this._connection) {
      throw new Error('数据库加载失败')
    }
    return this._connection
  }
}
