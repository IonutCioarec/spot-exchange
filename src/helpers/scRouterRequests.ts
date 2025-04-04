import {
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
} from '@multiversx/sdk-core';

import { network, routerContractAddress, pairsContractAddress, farmsContractAddress  } from 'config';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { getRouterSmartContractObj } from './smartContractHelpers';

export const Provider = new ProxyNetworkProvider(network.gatewayAddress, { timeout: 10000 });
export const resultsParser = new ResultsParser();

export const getRouterBaseTokens = async () => {
  const contract = await getRouterSmartContractObj();
  const interaction = contract.methodsExplicit.getBaseTokens();

  const query = interaction.buildQuery();
  const response = await Provider.queryContract(query);
  const endpointDef = interaction.getEndpoint();
  const parsedResponse = resultsParser.parseQueryResponse(
    response,
    endpointDef
  );
  if (parsedResponse.returnCode.isSuccess()) {
    const value = parsedResponse.firstValue?.valueOf();
    return value;
  }
  return [];
};

export const getPairCreationState = async () => {
  const contract = await getRouterSmartContractObj();
  const interaction = contract.methodsExplicit.getPairCreationEnabled();

  const query = interaction.buildQuery();
  const response = await Provider.queryContract(query);
  const endpointDef = interaction.getEndpoint();
  const parsedResponse = resultsParser.parseQueryResponse(
    response,
    endpointDef
  );
  if (parsedResponse.returnCode.isSuccess()) {
    const value = parsedResponse.firstValue?.valueOf();
    return value;
  }
  return [];
};

export const getBurnAddress = async () => {
  const contract = await getRouterSmartContractObj();
  const interaction = contract.methodsExplicit.getBurnAddress();

  const query = interaction.buildQuery();
  const response = await Provider.queryContract(query);
  const endpointDef = interaction.getEndpoint();
  const parsedResponse = resultsParser.parseQueryResponse(
    response,
    endpointDef
  );
  if (parsedResponse.returnCode.isSuccess()) {
    const value = parsedResponse.firstValue?.valueOf();
    return value;
  }
  return [];
};

export const getVaultAddress = async () => {
  const contract = await getRouterSmartContractObj();
  const interaction = contract.methodsExplicit.getVaultAddress();

  const query = interaction.buildQuery();
  const response = await Provider.queryContract(query);
  const endpointDef = interaction.getEndpoint();
  const parsedResponse = resultsParser.parseQueryResponse(
    response,
    endpointDef
  );
  if (parsedResponse.returnCode.isSuccess()) {
    const value = parsedResponse.firstValue?.valueOf();
    return value;
  }
  return [];
};