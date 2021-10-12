import { TARGET_MAINNET } from '@/utils/env';

export const WalletName = {
  MetaMask: 'MetaMask',
  Math: 'Math Wallet',
  NeoLine: 'NeoLine',
  O3: 'O3',
  Binance: 'Binance',
  Cyano: 'Cyano',
  WalletConnect: 'WalletConnnect',
};

export const ChainId = {
  Poly: 0,
  Eth: 2,
  Ont: 3,
  Neo: TARGET_MAINNET ? 4 : 5,
  Bsc: TARGET_MAINNET ? 6 : 79,
  Heco: 7,
  Ok: TARGET_MAINNET ? 12 : 200,
  Palette: TARGET_MAINNET ? 8 : 107,
  Polygon: TARGET_MAINNET ? 17 : 202,
  Arbitrum: TARGET_MAINNET ? 19 : 205,
};

export const SingleTransactionStatus = {
  Failed: -1,
  Pending: 1,
  Done: 2,
};

export const TransactionStatus = {
  Failed: -1,
  Finished: 0,
  Pending: 1,
  SourceDone: 2,
  SourceConfirmed: 3,
  PolyConfirmed: 4,
};
