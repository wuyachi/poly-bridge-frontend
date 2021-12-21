import Vue from 'vue';
import getStoreKey from '@/utils/getStoreKey';
import { getWalletApi } from '@/utils/walletApi';

export default {
  state: {
    allowanceMap: {},
  },
  getters: {
    getAllowance: state => ({ chainId, address, tokenHash, finSpender }) =>
      state.allowanceMap[getStoreKey({ chainId, address, tokenHash, finSpender })],
  },
  mutations: {
    setAllowance(state, { params, value }) {
      Vue.set(state.allowanceMap, getStoreKey(params), value);
    },
  },
  actions: {
    async getAllowance(
      { getters, commit },
      { chainId, toChainId, address, tokenHash, spender, spender2 },
    ) {
      const wallet = getters.getChainConnectedWallet(chainId);
      let allowance = null;
      let finSpender = spender;
      if (toChainId === 300 || chainId === 300) {
        finSpender = spender2;
      }
      if (wallet) {
        const walletApi = await getWalletApi(wallet.name);
        allowance = await walletApi.getAllowance({ chainId, address, tokenHash, finSpender });
      }
      const oldValue = getters.getAllowance({ chainId, address, tokenHash, finSpender });
      if (oldValue !== allowance) {
        commit('setAllowance', {
          params: { chainId, address, tokenHash, finSpender },
          value: allowance,
        });
      }
    },
  },
};
