import Vue from 'vue';
import getStoreKey from '@/utils/getStoreKey';
import httpApi from '@/utils/httpApi';

export default {
  state: {
    feeMap: {},
    manualTxDataMap: {},
  },
  getters: {
    getFee: state => ({ fromChainId, fromTokenHash, toTokenHash, toChainId }) =>
      state.feeMap[getStoreKey({ fromChainId, fromTokenHash, toTokenHash, toChainId })],
    getManualTxData: state => ({ polyHash }) => state.manualTxDataMap[getStoreKey({ polyHash })],
  },
  mutations: {
    setFee(state, { params, value }) {
      Vue.set(state.feeMap, getStoreKey(params), value);
    },
    setManualTxData(state, { params, value }) {
      Vue.set(state.manualTxDataMap, getStoreKey(params), value);
    },
  },
  actions: {
    async getFee({ commit }, { fromChainId, fromTokenHash, toTokenHash, toChainId }) {
      // const fee = await httpApi.getFee({ fromChainId, fromTokenHash, toTokenHash, toChainId });
      let fee;
      // mock data to test Eth(Ethereum) to xEth(Starcoiin)
      if (
        fromTokenHash === '0000000000000000000000000000000000000000' &&
        fromChainId === 2 &&
        toChainId === 318
      ) {
        fee = {
          SrcChainId: 2,
          Hash: '0000000000000000000000000000000000000000',
          DstChainId: 318,
          UsdtAmount: '0.2146000008',
          TokenAmount: '0.00007058',
          TokenAmountWithPrecision: '7.05835147695839651e+13',
          SwapTokenHash: '0x18351d311d32201149a4df2a9fc2db8a::XETH::XETH',
          Balance: '2.9553450781056623352e+29',
          BalanceWithPrecision: '2.9553450781056623352e+47',
        };
      } else if (
        fromTokenHash === '0x18351d311d32201149a4df2a9fc2db8a::XETH::XETH' &&
        fromChainId === 318 &&
        toChainId === 2
      ) {
        fee = {
          SrcChainId: 318,
          Hash: '0x18351d311d32201149a4df2a9fc2db8a::XETH::XETH',
          DstChainId: 2,
          UsdtAmount: '0.2146000008',
          TokenAmount: '0.00007058',
          TokenAmountWithPrecision: '7.05835147695839651e+13',
          SwapTokenHash: '0000000000000000000000000000000000000000',
          Balance: '2.9553450781056623352e+29',
          BalanceWithPrecision: '2.9553450781056623352e+47',
        };
      } else {
        fee = await httpApi.getFee({ fromChainId, fromTokenHash, toTokenHash, toChainId });
      }
      commit('setFee', {
        params: { fromChainId, fromTokenHash, toTokenHash, toChainId },
        value: fee,
      });
    },
    async getManualTxData({ commit }, polyHash) {
      const manualTxData = await httpApi.getManualTxData({ polyHash });
      commit('setManualTxData', { params: { polyHash }, value: manualTxData });
    },
  },
};
