import { Config } from '../config'
import { Contracts } from '../contracts'
import { Button, Input } from '@peerme/web-ui'
import { sanitizeNumeric } from '@peerme/core-ts'
import { TokenPayment } from '@multiversx/sdk-core'
import React, { SyntheticEvent, useState } from 'react'
import { useApp } from '../../../../shared/hooks/useApp'
import { AppSection } from '../../../../shared/ui/elements'
import { DataNftMetadata, MarketRequirements } from '../types'

type Props = {
  nft: DataNftMetadata
  marketRequirements: MarketRequirements
}

export const _MarketListSection = (props: Props) => {
  const app = useApp()
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState('10')
  const totalPrice = +amount * +price

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const addOfferScInfo = Contracts(app.config).AddOffer
    const paymentTokenId = Config.TokenId(app.config.network)
    const paymentTokenNonce = 0
    app.requestProposalAction(
      addOfferScInfo.Address,
      addOfferScInfo.Endpoint,
      0,
      [paymentTokenId, paymentTokenNonce, props.marketRequirements.sellerFee, +amount],
      [TokenPayment.semiFungible(props.nft.collection, props.nft.nonce, +amount)]
    )
  }

  return (
    <AppSection title="List on Marketplace">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="pl-1 text-xl mb-2 text-gray-800 dark:text-gray-200">
            How many do you want to list?
          </label>
          <Input
            id="amount"
            placeholder="amount"
            type="number"
            value={amount}
            onChange={(val) => setAmount(sanitizeNumeric(val))}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="pl-1 text-xl mb-2 text-gray-800 dark:text-gray-200">
            For how much?
          </label>
          <Input
            id="price"
            placeholder="price"
            type="number"
            value={price}
            onChange={(val) => setPrice(sanitizeNumeric(val))}
            required
            autoComplete="off"
          />
        </div>
        <ul className="text-gray-700 dark:text-gray-200 text-lg pl-2 mb-8">
          <li>
            Seller Tax (per NFT): <strong>{props.marketRequirements.sellerFee}</strong>
          </li>
        </ul>
        <Button color="blue" className="block w-full" submit>
          List {amount} NFT for {totalPrice} {Config.TokenName}
        </Button>
      </form>
    </AppSection>
  )
}
