import { Transaction } from 'types/sdkCoreTypes';
import { TransactionsDisplayInfoType } from 'types/sdkDappTypes';

import { refreshAccount, sendTransactions } from './sdkDappHelpers';
import { isSafari } from 'utils/responsive';

type SignAndSendTransactionsProps = {
  transactions: Transaction[];
  callbackRoute: string;
  transactionsDisplayInfo: TransactionsDisplayInfoType;
};

export const signAndSendTransactions = async ({
  transactions,
  callbackRoute,
  transactionsDisplayInfo
}: SignAndSendTransactionsProps) => {
  await refreshAccount();

  const { sessionId } = await sendTransactions({
    transactions,
    transactionsDisplayInfo,
    redirectAfterSign: false,
    callbackRoute,
    // NOTE: performing async calls (eg: `await refreshAccount()`) before opening a new tab
    // can cause the new tab to be blocked by Safari's popup blocker.
    // To support this feature, we can set `hasConsentPopup` to `true`
    hasConsentPopup: isSafari
  });

  return sessionId;
};
