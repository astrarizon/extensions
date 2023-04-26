import React from 'react'
import { ProposalAction } from '@peerme/core-ts'
import { Network, ExtensionScInfo, ExtensionConfig } from '../../../shared/types'
import { CreateActionPreview } from './previews/CreateActionPreview'

const getContractAddress = (network: Network) => {
  if (network === 'devnet') return 'erd1qqqqqqqqqqqqqpgqsanann348xhns6qx94rgcq8davw005vnlzhsezyt7t'
  if (network === 'testnet') return '#'

  return '#'
}

export const PulsarMoneyContracts = (config: ExtensionConfig): ExtensionScInfo => ({
  CreateVesting: {
    Address: getContractAddress(config.network),
    Endpoint: 'create',
    ActionPreview: (action: ProposalAction) => <CreateActionPreview action={action} />,
  },
})
