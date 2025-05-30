import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Address, AddressValue } from '@multiversx/sdk-core/out';
import { getDynamicPairsSmartContractObj, sendAndSignTransactionsWrapped, transactionDisplayInfo } from 'helpers';

export const usePoolsResume = (pair_address: string) => {
  const { account } = useGetAccountInfo();

  const resumePool = async () => {
    const contract = await getDynamicPairsSmartContractObj(pair_address);
    const interaction = contract.methodsExplicit.resume();

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
