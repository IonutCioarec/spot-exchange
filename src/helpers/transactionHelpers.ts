import { Transaction } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { TransactionWatcher } from '@multiversx/sdk-core/out';
import { network } from 'config';

export const watcher = new TransactionWatcher(new ApiNetworkProvider(network.apiAddress), { patienceMilliseconds: 8000 });

interface TransactionDisplayInfoProps {
  transactionName: string;
  successTransactionName: string;
}

export const transactionDisplayInfo = ({ transactionName, successTransactionName = 'Transaction' }: TransactionDisplayInfoProps) => {
  return {
    processingMessage: `Processing ${transactionName} transaction`,
    errorMessage: 'An error has occurred while processing the transaction',
    successMessage: `${successTransactionName} successfully`
  };
};

export const sendAndSignTransactions = async (
  transactions: Transaction[],
  transactionsDisplayInfo: TransactionsDisplayInfoType,
  minGasLimit = 20000000
): Promise<{
  success: boolean;
  error: string;
  sessionId: string | null;
}> => {
  try {
    await refreshAccount();

    const { sessionId, error } = await sendTransactions({
      transactions: transactions.map((t) => t.toPlainObject()),
      transactionsDisplayInfo,
      minGasLimit
    });

    await refreshAccount();
    return { success: error !== undefined, error: error ?? '', sessionId };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message, sessionId: null };
  }
};