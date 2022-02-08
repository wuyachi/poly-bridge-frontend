import Vue from 'vue';
import {
  reverseHex,
  integerToHex,
  toStandardHex,
  objectToBase64,
  base64ToObject,
} from '@/utils/convertors';
import { ChainId } from '@/utils/enums';
import { WalletError } from '@/utils/errors';
import { formatEnum } from '@/utils/formatters';
import { CHAINS } from '@/utils/values';
import { TARGET_MAINNET } from '@/utils/env';

const CHAIN_SELECTED_WALLETS_KEY = 'CHAIN_SELECTED_WALLETS';

const ETH_NETWORK_CHAIN_ID_MAPS = {
  [ChainId.Eth]: TARGET_MAINNET ? 1 : 3,
  [ChainId.Bsc]: TARGET_MAINNET ? 56 : 97,
  [ChainId.Heco]: TARGET_MAINNET ? 128 : 256,
  [ChainId.Ok]: TARGET_MAINNET ? 66 : 65,
  [ChainId.xDai]: TARGET_MAINNET ? 100 : 77,
  [ChainId.Polygon]: TARGET_MAINNET ? 137 : 80001,
  [ChainId.Palette]: TARGET_MAINNET ? 1718 : 101,
  [ChainId.Arbitrum]: TARGET_MAINNET ? 42161 : 421611,
  [ChainId.Optimistic]: TARGET_MAINNET ? 10 : 69,
  [ChainId.Fantom]: TARGET_MAINNET ? 250 : 4002,
  [ChainId.Avalanche]: TARGET_MAINNET ? 43114 : 43113,
  [ChainId.Metis]: TARGET_MAINNET ? 1088 : 588,
  [ChainId.Oasis]: TARGET_MAINNET ? 42262 : 42261,
};

export default {
  state: {
    chainMap: CHAINS.reduce((pre, cur) => {
      const lockContractHash = cur.lockContractHash && toStandardHex(cur.lockContractHash);
      return { ...pre, [cur.id]: { ...cur, lockContractHash } };
    }, {}),
    chainSelectedWalletMap: {},
  },
  getters: {
    chains: (state, getters) => {
      return Object.keys(state.chainMap).map(key => getters.getChain(key));
    },
    getChain: state => id => {
      const chain = state.chainMap[id];
      if (!chain) {
        return null;
      }
      return { ...chain, selectedWalletName: state.chainSelectedWalletMap[id] };
    },
    getChainConnectedWallet: (state, getters) => id => {
      const wallet = getters.getWallet(state.chainSelectedWalletMap[id]);
      return wallet && wallet.connected ? wallet : null;
    },
  },
  mutations: {
    setChainSelectedWallet(state, { chainId, walletName }) {
      Vue.set(state.chainSelectedWalletMap, chainId, walletName);
    },
    setChainSelectedWalletMap(state, map) {
      state.chainSelectedWalletMap = map;
    },
  },
  actions: {
    loadChainSelectedWallets({ commit }) {
      const data = base64ToObject(sessionStorage.getItem(CHAIN_SELECTED_WALLETS_KEY), null);
      if (data) {
        commit('setChainSelectedWalletMap', data);
      }
    },
    saveChainSelectedWallets({ state }) {
      const data = objectToBase64(state.chainSelectedWalletMap);
      sessionStorage.setItem(CHAIN_SELECTED_WALLETS_KEY, data);
    },
    setChainSelectedWallet({ commit, dispatch }, { chainId, walletName }) {
      commit('setChainSelectedWallet', { chainId, walletName });
      dispatch('saveChainSelectedWallets');
    },
    async ensureChainWalletReady({ getters }, chainId) {
      const wallet = getters.getChainConnectedWallet(chainId);
      if (!wallet) {
        throw new WalletError('Wallet is not connected.', {
          code: WalletError.CODES.NOT_CONNECTED,
          detail: {
            chainName: formatEnum(chainId, { type: 'chainName' }),
          },
        });
      }
      if (wallet.chainId !== chainId) {
        const fromChainId = ETH_NETWORK_CHAIN_ID_MAPS[chainId];
        const waitChainId = `0x${fromChainId.toString(16)}`;
        try {
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: waitChainId }],
          });
        } catch (switchError) {
          console.log(switchError);
        }
        throw new WalletError('Wallet is not in correct network.', {
          code: WalletError.CODES.INCORRECT_NETWORK,
          detail: {
            walletName: formatEnum(wallet.name, { type: 'walletName' }),
            chainNetworkName: formatEnum(chainId, { type: 'chainNetworkName' }),
          },
        });
      }
    },
  },
};
