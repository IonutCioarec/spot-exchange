import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, Address, AddressValue } from '@multiversx/sdk-core/out';
import { TransactionsDisplayInfoType } from '@multiversx/sdk-dapp/types';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo, watcher } from 'helpers';

export const usePoolsSetLocalRoles = (pair_address: string) => {
  const { account } = useGetAccountInfo();

  const setLocalRoles = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.setLocalRoles([
      new AddressValue(new Address(pair_address))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(85_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'set local roles', successTransactionName: 'Local roles setted' })
    );
    return sessionId;
  };

  return setLocalRoles;
};
