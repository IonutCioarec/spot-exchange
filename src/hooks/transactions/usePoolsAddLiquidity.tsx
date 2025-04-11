import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Address, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { getDynamicPairsSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

interface TokenProps {
  token_id: string,
  token_decimals: number,
  token_amount: number
}

export const usePoolsAddLiquidity = (pair_address: string, token1: TokenProps, token2: TokenProps) => {
  const { account, address } = useGetAccountInfo();

  const addLiquidity = async () => {
    const contract = await getDynamicPairsSmartContractObj(pair_address);
    const interaction = contract.methodsExplicit.addLiquidity([
      new BigUIntValue(new BigNumber(token1.token_amount).multipliedBy(0.95).multipliedBy(new BigNumber(10).pow(token1.token_decimals))),
      new BigUIntValue(new BigNumber(token2.token_amount).multipliedBy(0.95).multipliedBy(new BigNumber(10).pow(token2.token_decimals)))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(30_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withSender(new Address(address))
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
