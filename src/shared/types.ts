import { BigNumber } from 'bignumber.js'
import { TokenPayment } from '@multiversx/sdk-core'
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers'
import { ScInfo, Entity, EntityTag, ChainWallet, ProposalActionArg, SearchServiceConfig } from '@peerme/core-ts'

export type Network = 'devnet' | 'testnet' | 'mainnet'

/**
 * Extension
 */

export type ExtensionConfig = {
  network: Network
  entity: Entity
  walletConfig: ChainWallet
  searchConfig: SearchServiceConfig
  hasEarlyAccess: boolean
  dark: boolean
}

export type ExtensionScInfo = {
  [key: string]: ScInfo
}

export type ExtensionInfo = {
  Enabled: boolean
  Name: string
  Description: string
  Website: string
  Logo: {
    Light: string
    Dark: string
  }
  Tags: EntityTag[]
  Contracts: ExtensionScInfo
  AppRoot: React.FC | null
  WidgetRoots: {
    Info: React.FC<WidgetRootProps> | null
  }
  Developer: {
    Name: string
    Website: string
  }
}

/**
 * App
 */
export type AppToastType = 'success' | 'info' | 'warning' | 'error' | 'vibe'

export type AppContextValue = {
  config: ExtensionConfig
  networkProvider: ApiNetworkProvider
  requestProposalAction: (
    destination: string,
    endpoint: string | null,
    value: BigNumber.Value,
    args: ProposalActionArg[],
    payments: TokenPayment[]
  ) => void
  showToast: (text: string, type?: AppToastType) => void
}

/**
 * Widget
 */
export type WidgetRootProps = {
  config: ExtensionConfig
}
