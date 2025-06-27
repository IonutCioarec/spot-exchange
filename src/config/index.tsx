import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://devnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;
export const routerContractAddress = 'erd1qqqqqqqqqqqqqpgqz0lg63rtym20v32uqk38hsfusl5gdln0v2vsv3nu9h';
export const pairsContractAddress = 'erd1qqqqqqqqqqqqqpgqzqssw63jn0ep64t5mzghuhxdl5n6wf6mv2vsvyf97u';
export const farmsContractAddress = 'erd1qqqqqqqqqqqqqpgqhpj7s6f9jy0t593mcl4zpehmxwp56r7uv2vsg8tuma';
export const dexAPI = 'https://priv-backend.x-launcher.com/api';
export const poolLPTokenPrice = 0.05;

export const poolBaseTokens = {
  token1: {
    id: 'LEGLD-e8378b',
    ticker: 'LEGLD',
    image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/LEGLD-e8378b/icon.png',
    decimals: 18
  },
  token2: {
    id: 'MEX-a659d0',
    ticker: 'MEX',
    image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/MEX-a659d0/icon.png',
    decimals: 18
  },
  token3: {
    id: 'USDC-350c4e',
    ticker: 'USDC',
    image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.png',
    decimals: 6
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

export const nativeAuthConfig = {
  origin: 'http://localhost:3000',
  apiUrl: 'https://devnet-api.multiversx.com',
  expirySeconds: 21600,
};