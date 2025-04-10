import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer, TokenIdentifierValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';
import { SwapStep } from 'types/backendTypes';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { useSelector } from 'react-redux';

interface TokenProps {
  token_id: string;
  token_decimals: number;
  token_amount: string;
}

export const useSwapTokensRouter = (
  tokenInDetails: TokenProps,
  swapSteps: SwapStep[],
  tokenOutDetails: TokenProps,
) => {
  const { account } = useGetAccountInfo();
  const allTokens = useSelector(selectAllTokensById);

  const swapTokens = async () => {
    const contract = await getRouterSmartContractObj();

    const swapOperations = swapSteps.map((step, index) => {
      const pairAddress = new AddressValue(new Address(step.sc_address));
      const pairMethodName = BytesValue.fromUTF8('swapTokensFixedInput');

      let pairTokenOut: TokenIdentifierValue;
      let pairAmountOut: BigUIntValue;

      const isLastStep = index === swapSteps.length - 1;
      if (!isLastStep && swapSteps[index + 1]) {
        pairTokenOut = new TokenIdentifierValue(swapSteps[index + 1].token_in);
        pairAmountOut = new BigUIntValue(new BigNumber(swapSteps[index + 1].x_in.raw).multipliedBy(new BigNumber(10).pow(allTokens[swapSteps[index + 1].token_in].decimals)));
      }else{
        pairTokenOut = new TokenIdentifierValue(tokenOutDetails.token_id);
        pairAmountOut = new BigUIntValue(new BigNumber(tokenOutDetails.token_amount).multipliedBy(new BigNumber(10).pow(tokenOutDetails.token_decimals)));
      }

      return [pairAddress, pairMethodName, pairTokenOut, pairAmountOut];
    });

    const interaction = contract.methods.multiPairSwap(swapOperations);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(90_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withSingleESDTTransfer(
        TokenTransfer.fungibleFromAmount(
          tokenInDetails.token_id,
          tokenInDetails.token_amount,
          tokenInDetails.token_decimals
        )
      )
      .buildTransaction();

    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({
        transactionName: 'Swapping',
        successTransactionName: 'Tokens swapped'
      })
    );

    return sessionId;
  };

  return swapTokens;
};
