import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue } from '@multiversx/sdk-core/out';
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

export const usePoolsIssueLPToken = (address: string, lp_token_display_name: string, lp_token_ticker: string) => {
  const { account } = useGetAccountInfo();

  const issueLpToken = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.issueLpToken([
      new AddressValue(new Address(address)),
      BytesValue.fromHex(lp_token_display_name),
      BytesValue.fromHex(lp_token_ticker)
    ]);

    const valueBig = new BigNumber(poolLPTokenPrice).multipliedBy(new BigNumber(10).pow(18));
    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(10_000_000)
      .withChainID(network.chainId)
      .withValue(new BigUIntValue(valueBig))
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'issue LP token', successTransactionName: 'LP token issued' })
    );
    return sessionId;
  };

  return issueLpToken;
};
