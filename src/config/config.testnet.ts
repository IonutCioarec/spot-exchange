import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://testnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.testnet;
export const routerContractAddress = '';
export const poolsContractAddress = '';
export const farmsContractAddress = '';
export const dexAPI = '';

export const poolBaseTokens = {
    token1: {
        id: 'xEGLD',
        ticker: 'xEGLD',
        image: egldLogo
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
