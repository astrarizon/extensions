import { Network } from '../../../shared/types'

export const Config = {
  Endpoints: {
    ClaimRewards: 'claimRewards',
    Delegate: 'delegate',
    ReDelegateRewards: 'reDelegateRewards',
    UnDelegate: 'unDelegate',
  },

  Urls: {
    Delegation: (network: Network) => {
      if (network === 'devnet') return 'https://devnet-delegation-api.multiversx.com'
      if (network === 'testnet') return 'https://testnet-delegation-api.multiversx.com'
      return 'https://delegation-api.multiversx.com'
    },
  },
}
