import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://testnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.testnet;
export const routerContractAddress = '';
export const pairsContractAddress = '';
export const farmsContractAddress = '';
export const dexAPI = '';
export const poolLPTokenPrice = 0.05;

export const poolBaseTokens = {
  token1: {
    id: 'xEGLD',
    ticker: 'xEGLD',
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
  id: 'testnet',
  name: 'testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://testnet-wallet.multiversx.com',
  apiAddress: 'https://testnet-api.multiversx.com',
  gatewayAddress: 'https://testnet-gateway.multiversx.com',
  explorerAddress: 'http://testnet-explorer.multiversx.com',
  graphQlAddress: 'https://exchange-graph.multiversx.com/graphql',
  skipFetchFromServer: true,
  chainId: 'T '
};

export const nativeAuthConfig = {
  origin: 'http://localhost:3001',
  apiUrl: 'https://testnet-api.multiversx.com',
  expirySeconds: 21600,
};
