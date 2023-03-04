import { CloudObjectStorage, CosProvider, CosSigner } from './types'
import TencentCosSigner from './impl/tencent/TencentCosSigner'
import TencentCOS from './impl/tencent/TencentCOS'


type CosFactoryReturnType = {
  signer: CosSigner
  cos: CloudObjectStorage
}

const CosFactory = (provider: CosProvider): CosFactoryReturnType => {
  switch (provider) {
    case 'tencent':
      return {
        signer: TencentCosSigner.INSTANCE,
        cos: TencentCOS.INSTANCE
      }
    default:
      throw new Error('unknown provider: ' + provider)
  }
}

export default CosFactory
