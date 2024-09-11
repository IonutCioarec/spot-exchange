import { EnvironmentsEnum } from 'types/sdkDappTypes';
export * from './sharedConfig';

export const API_URL = 'https://devnet-api.multiversx.com';
export const sampleAuthenticatedDomains = [API_URL];
export const environment = EnvironmentsEnum.devnet;
export const contractAddress = '';
//to use the proxy go to https://cors-anywhere.herokuapp.com/ and click unlock (this is to bypass the no-cors errors on the localhost)
export const dexAPI = 'https://cors-anywhere.herokuapp.com/https://priv-backend.x-launcher.com/api';
