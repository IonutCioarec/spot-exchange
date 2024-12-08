import { EnvironmentsEnum } from 'types/sdkDappTypes';
export * from './sharedConfig';

export const API_URL = 'https://devnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;
export const contractAddress = '';
export const dexAPI = 'https://priv-backend.x-launcher.com/api';