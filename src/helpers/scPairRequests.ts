import {
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
} from '@multiversx/sdk-core';

import { network, routerContractAddress, pairsContractAddress, farmsContractAddress  } from 'config';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { getDynamicPairsSmartContractObj } from './smartContractHelpers';

export const Provider = new ProxyNetworkProvider(network.gatewayAddress, { timeout: 10000 });
export const resultsParser = new ResultsParser();


export const getPairReservesAndTotalSupply = async (pair_address: string) => {
  const contract = await getDynamicPairsSmartContractObj(pair_address);
  const interaction = contract.methodsExplicit.getReservesAndTotalSupply();

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