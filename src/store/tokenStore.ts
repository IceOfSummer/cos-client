import { defineStore } from 'pinia'
import { deleteElement } from '../utils/Arrays'

export interface Token {
  bucketAlias: string
  accessKey: string
  accessToken: string
  bucket: string
  region: string
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
