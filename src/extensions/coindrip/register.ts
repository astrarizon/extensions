import Logo from './meta/logo.svg'
import { ExtensionInfo } from '../../types'
import { CoindripApp } from './src/CoindripApp'

export const CoindripExtension: ExtensionInfo = {
  Enabled: true,
  Name: 'CoinDrip',
  Description: 'A protocol for real-time ESDT payments.',
  Website: 'https://coindrip.finance',
  Logo: {
    Light: Logo,
    Dark: Logo,
  },
  Tags: ['defi'],
  AppRoot: CoindripApp,
  WidgetRoots: {
    Info: null,
  },
  Developer: {
    Name: 'PeerMe',
    Website: 'https://peerme.io',
  },
}
