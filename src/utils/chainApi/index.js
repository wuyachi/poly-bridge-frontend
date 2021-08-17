import { ChainError } from '@/utils/errors';
import { ChainId } from '@/utils/enums';

const APIS = {
  [ChainId.Eth]: () => import('./eth'),
  [ChainId.Neo]: () => import('./neo'),
  [ChainId.Bsc]: () => import('./eth'),
  [ChainId.Heco]: () => import('./eth'),
  [ChainId.Ont]: () => import('./ont'),
  [ChainId.Ok]: () => import('./eth'),
  [ChainId.Palette]: () => import('./Palette'),
  [ChainId.Polygon]: () => import('./eth'),
};

export async function getChainApi(chainId) {
  if (!APIS[chainId]) {
    throw new ChainError('Chain is not supported', {
      code: ChainError.CODES.NOT_SUPPORTED,
    });
  }
  return (await APIS[chainId]()).default;
}
