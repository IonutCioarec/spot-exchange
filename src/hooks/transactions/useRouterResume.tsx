import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Address, AddressValue } from '@multiversx/sdk-core/out';
import { getRouterSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo } from 'helpers';

export const useRouterResume = (pair_address: string) => {
  const { account } = useGetAccountInfo();

  const resumePool = async () => {
    const contract = await getRouterSmartContractObj();
    const interaction = contract.methodsExplicit.resume([
      new AddressValue(new Address(pair_address))
    ]);

    const transaction = interaction
      .withNonce(account.nonce)
      .withGasLimit(35_000_000)
      .withChainID(network.chainId)
      .withValue(0)
      .buildTransaction();
    const sessionId = await sendAndSignTransactionsWrapped(
      [transaction],
      transactionDisplayInfo({ transactionName: 'enable pool swap', successTransactionName: 'Pool swap enabled' })
    );
    return sessionId;
  };

  return resumePool;
};
