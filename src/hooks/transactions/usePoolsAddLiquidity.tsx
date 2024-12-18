import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getPairsSmartContractObj, sendAndSignTransactions, transactionDisplayInfo, watcher } from 'helpers';
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

export const usePoolsAddLiquidity = (token1: TokenProps, token2: TokenProps) => {
  const { account } = useGetAccountInfo();

  const addLiquidity = async () => {
    const contract = await getPairsSmartContractObj();
    const interaction = contract.methodsExplicit.addLiquidity([
      new BigUIntValue(new BigNumber(token1.token_amount).multipliedBy(new BigNumber(10).pow(token1.token_decimals))),
      new BigUIntValue(new BigNumber(token2.token_amount).multipliedBy(new BigNumber(10).pow(token2.token_decimals)))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(20_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withMultiESDTNFTTransfer([
        TokenTransfer.fungibleFromAmount(token1.token_id, token1.token_amount, token1.token_decimals),
        TokenTransfer.fungibleFromAmount(token2.token_id, token2.token_amount, token2.token_decimals)
      ])
      .buildTransaction();

    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'add liquidity ', successTransactionName: 'Liquidity added' })
    );
    return sessionId;
  };

  return addLiquidity;
};
