import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { BooleanValue } from '@multiversx/sdk-core/out';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo } from 'helpers';

export const usePoolsPairCreation = (enabled: boolean) => {
  const { account } = useGetAccountInfo();

  const pairCreation = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.setPairCreationEnabled([
      new BooleanValue(enabled)
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(35_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: `${enabled ? 'enable' : 'disable'} pool creation`, successTransactionName: `Pool creation ${enabled ? 'enabled' : 'disabled'}` })
    );
    return sessionId;
  };

  return pairCreation;
};
