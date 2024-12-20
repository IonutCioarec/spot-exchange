import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer, TokenIdentifierValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

interface TokenProps {
  token_id: string,
  token_decimals: number,
  token_amount: number
}

export const useSwapTokensRouter = (token1: TokenProps, token2: TokenProps, pair_address: string) => {
  const { account } = useGetAccountInfo();

  const swapTokensFixedInput = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.swapTokensFixedInput([
      new AddressValue(new Address(pair_address)),
      BytesValue.fromHex('swapTokensFixedInput'),
      new TokenIdentifierValue(token2.token_id),
      new BigUIntValue(new BigNumber(token2.token_amount).multipliedBy(new BigNumber(10).pow(token2.token_decimals)))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(70_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(token1.token_id, token1.token_amount, token1.token_decimals))
      .buildTransaction();

    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'swap ', successTransactionName: 'Swapped' })
    );
    return sessionId;
  };

  return swapTokensFixedInput;
};
