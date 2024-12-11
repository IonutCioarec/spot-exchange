import { EnvironmentsEnum } from 'types/sdkDappTypes';
export * from './sharedConfig';

export const API_URL = 'https://api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;
export const contractAddress = '';
export const dexAPI = '';

export const poolBaseTokens = {
    token1: {
        id: '',
        ticker: '',
        image: ''
    },
    token2: {
        id: '',
        ticker: '',
        image: ''
    },
    token3: {
        id: '',
        ticker: '',
        image: ''
    },
};
