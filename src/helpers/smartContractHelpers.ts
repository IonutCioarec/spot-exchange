import {
  AbiRegistry,
  Address,
  ResultsParser,
  SmartContract,
} from '@multiversx/sdk-core';

import { network, routerContractAddress, pairsContractAddress, farmsContractAddress  } from 'config';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import routerAbi from 'abi/router.abi.json';
import pairsAbi from 'abi/pair.abi.json';
import farmsAbi from 'abi/farm-fee-collector.abi.json';

export const Provider = new ProxyNetworkProvider(network.gatewayAddress, { timeout: 10000 });
export const resultsParser = new ResultsParser();

const formatAbiJson = (abi: any) => {
  return {
    name: abi.name,
    endpoints: abi.endpoints,
    types: abi.types
  };
};

export const getRouterSmartContractObj = async () => {
  const abiRegistry = await AbiRegistry.create(formatAbiJson(routerAbi));
  return new SmartContract({
    address: new Address(routerContractAddress),
    abi: abiRegistry
  });
};

export const getPairsSmartContractObj = async () => {
  const abiRegistry = await AbiRegistry.create(formatAbiJson(pairsAbi));
  return new SmartContract({
    address: new Address(pairsContractAddress),
    abi: abiRegistry
  });
};

export const getFarmsSmartContractObj = async () => {
  const abiRegistry = await AbiRegistry.create(formatAbiJson(farmsAbi));
  return new SmartContract({
    address: new Address(farmsContractAddress),
    abi: abiRegistry
  });
};

export const getDynamicPairsSmartContractObj = async (contractAddress: string) => {
  const abiRegistry = await AbiRegistry.create(formatAbiJson(pairsAbi));
  return new SmartContract({
    address: new Address(contractAddress),
    abi: abiRegistry
  });
};