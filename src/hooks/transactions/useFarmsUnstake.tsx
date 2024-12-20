import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network, poolLPTokenPrice } from 'config';
import { Transaction, BytesValue, Address, AddressValue, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getFarmsSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';
import BigNumber from 'bignumber.js';

export const useFarmsUnstake = (token_id: string, token_decimals: number, token_amount: number) => {
  const { account } = useGetAccountInfo();

  const unstake = async () => {
    const contract = await getFarmsSmartContractObj();
    const interaction = contract.methodsExplicit.startFarming();

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(70_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .withSingleESDTTransfer(TokenTransfer.fungibleFromAmount(token_id, token_amount, token_decimals))
      .buildTransaction();

    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'unstake ', successTransactionName: 'Unstaked' })
    );
    return sessionId;
  };

  return unstake;
};
