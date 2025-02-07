import React from 'react'
import BigNumber from 'bignumber.js'
import { Address } from '@multiversx/sdk-core'
import { AddressPresenter, Tooltip } from '@peerme/web-ui'
import { ActionPreviewHighlight } from '../../../../shared/ui/elements'
import { Constants, ProposalAction, toActionArgsTypedValue } from '@peerme/core-ts'

export type Props = {
  action: ProposalAction
}

enum Type {
  VAULT,
  PAYMENT,
  VESTING,
}

export const CreateActionPreview = (props: Props) => {
  const args = props.action.arguments
  const payments = props.action.payments
  const tokenId = payments.length > 0 ? payments[0].tokenId : Constants.EgldTokenIdentifier

  const value =
    tokenId === Constants.EgldTokenIdentifier
      ? new BigNumber(props.action.value)
          .dividedBy(10 ** 18)
          .toFixed(2)
          .toString()
      : new BigNumber(payments[0].amount.slice(4))
          .dividedBy(10 ** (payments[0].tokenDecimals || 1))
          .toFixed(2)
          .toString()

  const type = +toActionArgsTypedValue(args[0]).valueOf().toString('hex')

  if (type === Type.VESTING) {
    const receiverHex = toActionArgsTypedValue(args[3]).valueOf().toString('hex')
    const receiverAddr = Address.fromHex(receiverHex).bech32()

    const cliffRelease = args[4]?.toString().slice(4)

    const startTimestamp = parseInt(cliffRelease?.slice(16, 32) || '0', 16)
    const displayableCancel = args[2] === 'hex:01' ? 'cancelable' : 'non-cancelable'

    const vestRelease = args[5]?.toString().slice(4)
    const endTimestamp = parseInt(vestRelease?.slice(16, 32) || '0', 16)

    const frequency = parseInt(vestRelease?.slice(32, 48) || '1', 16)

    return (
      <ActionPreviewHighlight>
        start a <strong>{displayableCancel}</strong> vesting of {value} {tokenId} to
        <AddressPresenter value={receiverAddr} trim={4} inline /> , with a cliff release at{' '}
        <_Date value={new Date(startTimestamp * 1000)} />, ending on <_Date value={new Date(endTimestamp * 1000)} />,
        receiving payment every {frequencyText(frequency)}.
      </ActionPreviewHighlight>
    )
  } else if (type === Type.VAULT) {
    const release = toActionArgsTypedValue(args[4])?.valueOf().toString('hex')
    console.log({ release })
    const releaseTimestamp = parseInt(release?.slice(16, 32) || '0', 16) * 1000

    return (
      <ActionPreviewHighlight>
        create a vault for {value} {tokenId}, that will be released on <_Date value={new Date(releaseTimestamp)} /> at{' '}
        {new Date(releaseTimestamp).toLocaleTimeString()}.
      </ActionPreviewHighlight>
    )
  } else {
    return <ActionPreviewHighlight>Coming soon.</ActionPreviewHighlight>
  }
}

const _Date = (props: { value: Date }) => (
  <Tooltip tip={props.value.toLocaleTimeString()}>
    <span>{props.value.toLocaleDateString()}</span>
  </Tooltip>
)

const frequencyText = (frequency: number) => {
  switch (frequency) {
    case 1:
      return 'second'
    case 60 * 1:
      return 'minute'
    case 60 * 60 * 1:
      return 'hour'
    case 24 * 60 * 60 * 1:
      return 'day'
    case 7 * 24 * 60 * 60 * 1:
      return 'week'
    case 30 * 24 * 60 * 60 * 1:
      return 'month'
    default:
      return 'second'
  }
}
