import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;
export const routerContractAddress = '';
export const pairsContractAddress = '';
export const farmsContractAddress = '';
export const dexAPI = '';
export const poolLPTokenPrice = 1;
export const poolEnableSwapPrice = 1;

export const poolBaseTokens = {
  token1: {
    id: 'WEGLD-bd4d79',
    ticker: 'WEGLD',
    image: egldLogo,
    decimals: 18
  },
  token2: {
    id: '',
    ticker: '',
    image: '',
    decimals: 0
  },
  token3: {
    id: '',
    ticker: '',
    image: '',
    decimals: 0
  },
};

export const network = {
  id: 'mainnet',
  name: 'Mainnet',
  egldLabel: 'EGLD',
  walletAddress: 'https://wallet.multiversx.com',
  apiAddress: 'https://api.multiversx.com',
  gatewayAddress: 'https://gateway.multiversx.com',
  explorerAddress: 'http://explorer.multiversx.com',
  graphQlAddress: 'https://exchange-graph.multiversx.com/graphql',
  skipFetchFromServer: true,
  chainId: '1'
};
