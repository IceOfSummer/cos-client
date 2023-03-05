import { defineStore } from 'pinia'
import { deleteElement } from '../utils/Arrays'
import { CosProvider } from '../api/cos/types'

export interface Token {
  cosProvider: CosProvider
  secretId: string
  secretKey: string
  bucketAlias: string
  /**
   * 存储桶地址，如:https://xxxx.xxx
   *
   * 末尾不要带'/'
   */
  bucket: string
  /**
   * cdn访问域名
   */
  cdnUrl?: string
}

export type TokenStore = {
  tokens: Token[]
}

const searchFn = (searchBucketAlias: string) => (value: Token) => value.bucketAlias === searchBucketAlias

const useTokenStore = defineStore('token', {
  persist: true,
  state: (): TokenStore => {
    return {
      tokens: []
    }
  },
  actions: {
    /**
     * 添加一个Token。
     * @param token token，别名不能重复{@link Token#bucketAlias}
     * @throws Error 当别名发生冲突时
     */
    appendToken(token: Token) {
      if (!token.bucketAlias || token.bucketAlias.trim().length === 0) {
        throw new Error('存储桶别称不能为空')
      }
      if (this.tokens.findIndex(searchFn(token.bucketAlias)) >= 0) {
        throw new Error('该别名或存储桶名称已经存在')
      } else {
        this.tokens = [...this.tokens, token]
      }
    },
    removeToken(bucketAlias: string) {
      this.tokens = deleteElement(this.tokens, searchFn(bucketAlias))
    }
  }
})

export default useTokenStore
