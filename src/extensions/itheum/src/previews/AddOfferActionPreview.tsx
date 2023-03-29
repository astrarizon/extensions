import React from 'react'
import { TokenPayment } from '@multiversx/sdk-core'
import { ExtensionConfig } from '../../../../shared/types'
import { ProposalAction, toFormattedTokenPayment, toTokenPaymentFromProposalPayment } from '@peerme/core-ts'

type Props = {
  action: ProposalAction
  config: ExtensionConfig
}

export const AddOfferActionPreview = (props: Props) => {
  const paymentToken = props.action.arguments[0] as string
  const paymentFee = props.action.arguments[2] as string

  const displayableOfferPayments =
    props.action.payments.length > 0
      ? props.action.payments
          .map((payment) => toFormattedTokenPayment(toTokenPaymentFromProposalPayment(payment)))
          .join(', ')
      : toFormattedTokenPayment(TokenPayment.egldFromBigInteger(props.action.value))

  return (
    <>
      list <strong>{displayableOfferPayments}</strong> on marketplace for {paymentToken} with Fee {paymentFee}.
    </>
  )
}
