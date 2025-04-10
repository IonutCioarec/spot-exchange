import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer, TokenIdentifierValue, TransactionPayload } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, sendTransactions, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';
import { SwapStep } from 'types/backendTypes';
import { routerContractAddress } from 'config';
import { toHexExact } from 'utils/formatters';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import { useSelector } from 'react-redux';

interface TokenProps {
  token_id: string;
  token_decimals: number;
  token_amount: string;
}

export const useSwapTokensHex = (
  tokenInDetails: TokenProps,
  swapSteps: SwapStep[],
  tokenOutDetails: TokenProps,
) => {
  const { account, address } = useGetAccountInfo();
  const allTokens = useSelector(selectAllTokensById);

  const swapTokens = async () => {
    const tokenInHex = Buffer.from(tokenInDetails.token_id).toString('hex');

    const amountInBigInt = BigInt(
      new BigNumber(tokenInDetails.token_amount)
        .multipliedBy(new BigNumber(10).pow(tokenInDetails.token_decimals))
        .toFixed(0)
    );
    let amountInHex = amountInBigInt.toString(16);
    if (amountInHex.length % 2 !== 0) {
      amountInHex = amountInHex.padStart(amountInHex.length + 1, '0');
    }


    const functionHex = Buffer.from('multiPairSwap').toString('hex');

    const stepsHexArgs = swapSteps.map((step, index) => {
      const scAddressHex = new Address(step.sc_address).toHex();
      const hexMethodName = Buffer.from('swapTokensFixedInput').toString('hex');

      let tokenOutHex: string;
      let amountOutHex: string;

      const isLastStep = index === swapSteps.length - 1;

      if (!isLastStep && swapSteps[index + 1]) {
        tokenOutHex = Buffer.from(swapSteps[index + 1].token_in).toString('hex');
        const amountOutBigInt = BigInt(
          new BigNumber(swapSteps[index + 1].x_in.raw)
            .multipliedBy(new BigNumber(10).pow(allTokens[swapSteps[index + 1].token_in]?.decimals))
            .toFixed(0)
        );
        amountOutHex = amountOutBigInt.toString(16);
        if (amountOutHex.length % 2 !== 0) {
          amountOutHex = amountOutHex.padStart(amountOutHex.length + 1, '0');
        }
      } else {
        tokenOutHex = Buffer.from(tokenOutDetails.token_id).toString('hex');
        const amountOutBigInt = BigInt(
          new BigNumber(tokenOutDetails.token_amount)
            .multipliedBy(new BigNumber(10).pow(tokenOutDetails.token_decimals))
            .toFixed(0)
        );
        amountOutHex = amountOutBigInt.toString(16);
        if (amountOutHex.length % 2 !== 0) {
          amountOutHex = amountOutHex.padStart(amountOutHex.length + 1, '0');
        }
      }

      return [scAddressHex, hexMethodName, tokenOutHex, amountOutHex];
    });

    const args = stepsHexArgs.flat().join('@');
    const txData = `ESDTTransfer@${tokenInHex}@${amountInHex}@${functionHex}@${args}`;

    const tx = new Transaction({
      data: new TransactionPayload(txData),
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

