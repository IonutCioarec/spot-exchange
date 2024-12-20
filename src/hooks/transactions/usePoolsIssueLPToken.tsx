import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

export const usePoolsIssueLPToken = (pair_address: string, lp_token_display_name: string, lp_token_ticker: string) => {
  const { account } = useGetAccountInfo();

  const issueLpToken = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.issueLpToken([
      new AddressValue(new Address(pair_address)),
      BytesValue.fromHex(lp_token_display_name),
      BytesValue.fromHex(lp_token_ticker)
    ]);

    const valueBig = new BigNumber(poolLPTokenPrice).multipliedBy(new BigNumber(10).pow(18));
    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(85_000_000)
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
