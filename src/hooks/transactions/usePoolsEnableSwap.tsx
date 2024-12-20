import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolEnableSwapPrice } from 'config';
import { Transaction, Address, AddressValue, BigUIntValue } from '@multiversx/sdk-core/out';
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

export const usePoolsEnableSwap = (pair_address: string) => {
  const { account } = useGetAccountInfo();

  const setSwapEnabledByUser = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.setSwapEnabledByUser([
      new AddressValue(new Address(pair_address))
    ]);

    const valueBig = new BigNumber(poolEnableSwapPrice).multipliedBy(new BigNumber(10).pow(18));
    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(35_000_000)
      .withChainID(network.chainId)
      .withValue(new BigUIntValue(valueBig))
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'enable pool swap', successTransactionName: 'Pool swap enabled' })
    );
    return sessionId;
  };

  return setSwapEnabledByUser;
};
