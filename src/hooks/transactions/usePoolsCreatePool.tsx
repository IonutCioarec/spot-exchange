import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, TokenIdentifierValue, BytesValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getPairsSmartContractObj, sendAndSignTransactions, transactionDisplayInfo, watcher } from 'helpers';

const sendAndSignTransactionsWrapped = async (
  transactions: Transaction[],
  displayInfo: TransactionsDisplayInfoType
): Promise<{
  success: boolean;
  error: string;
  sessionId: string | null;
}> => {
  const result = await sendAndSignTransactions(transactions, displayInfo);
  await watcher.awaitCompleted(transactions[0]);
  return result;
};

export const usePoolsCreatePool = (first_token_id: string, second_token_id: string, signature: any) => {
  const { account } = useGetAccountInfo();

  const createPool = async () => {
    const contract = await getPairsSmartContractObj();
    const interaction = contract.methodsExplicit.createPair([
      new TokenIdentifierValue(first_token_id),
      new TokenIdentifierValue(second_token_id),
      BytesValue.fromHex(signature)
    ]);

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
