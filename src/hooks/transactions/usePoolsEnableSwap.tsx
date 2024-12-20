import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, Address, AddressValue, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactions, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

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

interface TokenProps {
  token_id: string,
  token_decimals: number,
  token_amount: number
}

export const usePoolsEnableSwap = (pair_address: string, token: TokenProps) => {
  const { account } = useGetAccountInfo();

  const setSwapEnabledByUser = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.setSwapEnabledByUser([
      new AddressValue(new Address(pair_address))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(35_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(token.token_id, token.token_amount, token.token_decimals))
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'enable pool swap', successTransactionName: 'Pool swap enabled' })
    );
    return sessionId;
  };

  return setSwapEnabledByUser;
};
