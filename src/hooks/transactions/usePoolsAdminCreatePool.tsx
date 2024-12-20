import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, TokenIdentifierValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';

export const usePoolsAdminCreatePool = (first_token_id: string, second_token_id: string) => {
  const { account } = useGetAccountInfo();

  const createPool = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.adminCreatePair([new TokenIdentifierValue(first_token_id), new TokenIdentifierValue(second_token_id)]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(10_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'create pool', successTransactionName: 'Pool created' })
    );
    return sessionId;
  };

  return createPool;
};
