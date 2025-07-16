import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { Transaction, TransactionPayload } from '@multiversx/sdk-core/out';
import { sendAndSignTransactionsWrapped, transactionDisplayInfo } from 'helpers';
import { routerContractAddress } from 'config';

export const useSwapTokensV2 = (swapTx: string) => {
  const { address } = useGetAccountInfo();

  const swapTokens = async () => {
    const tx = new Transaction({
      data: new TransactionPayload(swapTx),
      gasLimit: 70_000_000,
      sender: address,
      receiver: routerContractAddress,
      value: 0,
      chainID: "D"
    });

    const sessionId = await sendAndSignTransactionsWrapped(
      [tx],
      transactionDisplayInfo({
        transactionName: 'Swapping',
        successTransactionName: 'Tokens swapped'
      })
    );

    return sessionId;
  };

  return swapTokens;
};

