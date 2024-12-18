import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://devnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;
export const routerContractAddress = '';
export const pairsContractAddress = '';
export const farmsContractAddress = '';
export const dexAPI = 'https://priv-backend.x-launcher.com/api';
export const poolLPTokenPrice = 1;
export const poolEnableSwapPrice = 1;

export const poolBaseTokens = {
  token1: {
    id: 'xEGLD',
    ticker: 'xEGLD',
    image: egldLogo,
    decimals: 18
  },
  token2: {
    id: 'USDC-350c4e',
    ticker: 'USDC',
    image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.png',
    decimals: 6
  },
  token3: {
    id: 'XTICKET-6e9b83',
    ticker: 'XTICKET',
    image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/XTICKET-6e9b83/icon.svg',
    decimals: 18
  },
};

export const network = {
  id: 'devnet',
  name: 'devnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.multiversx.com',
  apiAddress: 'https://devnet-api.multiversx.com',
  gatewayAddress: 'https://devnet-gateway.multiversx.com',
  explorerAddress: 'http://devnet-explorer.multiversx.com',
  graphQlAddress: 'https://exchange-graph.multiversx.com/graphql',
  skipFetchFromServer: true,
  chainId: 'D'
};