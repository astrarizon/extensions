import { TransactionDecoder } from '@elrondnetwork/transaction-decoder'
import { BytesValue, TokenPayment } from '@multiversx/sdk-core/out'
import { Button, Input, PaymentSelector } from '@peerme/web-ui'
import React, { SyntheticEvent, useState } from 'react'
import { useApp } from '../../../shared/hooks/useApp'
import { currentTimestamp, INITIAL_END, MAX_NAME_LENGTH } from './utils'
import { BigNumber } from 'bignumber.js'
import * as sdk from './sdk'

export const _Vaults = () => {
  const app = useApp()

  const [tokenPayment, setTokenPayment] = useState<TokenPayment | null>(null)
  const [releaseDate, setReleaseDate] = useState(INITIAL_END)
  const [name, setName] = useState('')

  const isSubmitDisabled = !tokenPayment || !releaseDate || tokenPayment.amountAsBigInteger.isEqualTo(new BigNumber(0))

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const address = app?.config?.entity?.address

    if (!tokenPayment) return
    if (!address) return

    const releaseTimestampInMiliseconds = new Date(releaseDate).getTime()
    const totalAmount = +tokenPayment.amountAsBigInteger.dividedBy(10 ** tokenPayment.numDecimals).toString()

    if (releaseTimestampInMiliseconds < currentTimestamp) {
      app.showToast('Release date must be set to the future', 'error')
      return
    }

    if (name.length > MAX_NAME_LENGTH) {
      app.showToast(`Name must not have more than ${MAX_NAME_LENGTH} characters`, 'error')
      return
    }

    const transaction = await sdk.createVault(
      tokenPayment.tokenIdentifier,
      totalAmount,
      releaseTimestampInMiliseconds,
      name,
      address
    )

    const metadata = new TransactionDecoder().getTransactionMetadata(transaction)
    const value = tokenPayment.isEgld() ? new BigNumber(metadata.value.toString()) : new BigNumber(0)

    let payments: TokenPayment[] = []

    if (!tokenPayment.isEgld()) {
      if (!metadata || !metadata.transfers || !metadata.transfers[0]) return

      const token = new TokenPayment(
        tokenPayment.tokenIdentifier,
        tokenPayment.nonce,
        new BigNumber(metadata.transfers[0].value.toString()),
        tokenPayment.numDecimals
      )

      payments.push(token)
    }

    app.requestProposalAction(
      metadata.receiver,
      metadata.functionName || '',
      value,
      metadata.functionArgs.map((arg) => BytesValue.fromHex(arg)) || [],
      payments
    )
  }
  return (
    <form onSubmit={handleSubmit}>
      <PaymentSelector
        config={app.config.walletConfig}
        entity={app.config.entity}
        permissions={[]}
        onSelected={(val) => setTokenPayment(val)}
        className="mb-4"
      />
      <div className="mb-4">
        <label htmlFor="release_date" className="pl-1 text-xl mb-2 text-gray-800 dark:text-gray-200">
          Ends at (your local time)
        </label>
        <Input
          id="release_date"
          type="datetime-local"
          placeholder="Unlocks at ..."
          value={releaseDate}
          onChange={(val) => setReleaseDate(val)}
          required
        />
      </div>
      <div className="mb-4">
        <div>
          <Input value={name} onChange={(val) => setName(val)} placeholder="Vault name" />
        </div>
      </div>

      <Button color="blue" className="block w-full" disabled={isSubmitDisabled} submit>
        Create Vault
      </Button>
    </form>
  )
}
