import { EnvironmentsEnum } from 'types/sdkDappTypes';
import egldLogo from 'assets/img/egld_logo.svg';
export * from './sharedConfig';

export const API_URL = 'https://api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.mainnet;
export const routerContractAddress = '';
export const poolsContractAddress = '';
export const farmsContractAddress = '';
export const dexAPI = '';

export const poolBaseTokens = {
    token1: {
        id: 'EGLD',
        ticker: 'EGLD',
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
