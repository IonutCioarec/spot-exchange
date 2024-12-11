import { EnvironmentsEnum } from 'types/sdkDappTypes';
export * from './sharedConfig';

export const API_URL = 'https://devnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;
export const contractAddress = '';
export const dexAPI = 'https://priv-backend.x-launcher.com/api';

export const poolBaseTokens = {
    token1: {
        id: 'xEGLD',
        ticker: 'xEGLD',
        image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/EGLD/icon.png'
    },
    token2: {
        id: 'USDC-350c4e',
        ticker: 'USDC',
        image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.png'
    },
    token3: {
        id: 'XTICKET-6e9b83',
        ticker: 'XTICKET',
        image: 'https://tools.multiversx.com/assets-cdn/devnet/tokens/XTICKET-6e9b83/icon.svg'
    },
};