import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, TokenIdentifierValue, BytesValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';

export const usePoolsCreatePool = (first_token_id: string, second_token_id: string, signature: any) => {
  const { account } = useGetAccountInfo();

  const createPool = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.createPair([
      new TokenIdentifierValue(first_token_id),
      new TokenIdentifierValue(second_token_id),
      BytesValue.fromHex(signature)
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(50_000_000)
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
