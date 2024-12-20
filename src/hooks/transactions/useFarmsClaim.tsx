import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getFarmsSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

export const useFarmsClaim = () => {
  const { account } = useGetAccountInfo();

  const stake = async () => {
    const contract = await getFarmsSmartContractObj();
    const interaction = contract.methodsExplicit.claimRewards();

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(70_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .buildTransaction();

    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'claim ', successTransactionName: 'Claimed' })
    );
    return sessionId;
  };

  return stake;
};
