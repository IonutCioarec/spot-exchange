import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account';
import { network } from 'config';
import { Transaction, TransactionPayload } from '@multiversx/sdk-core/out';
import { sendAndSignTransactionsWrapped, transactionDisplayInfo } from 'helpers';
import BigNumber from 'bignumber.js';

interface TokenProps {
  name: string;
  ticker: string;
  amount: string;
  decimals: string;
  roles: Record<string, boolean>;
}

export const useIssueToken = (token: TokenProps) => {
  const { address } = useGetAccountInfo();

  const issueToken = async () => {
    const hexName = Buffer.from(token.name).toString('hex');
    const hexTicker = Buffer.from(token.ticker).toString('hex');
    let hexDecimals = new BigNumber(token.decimals).toString(16);
    if (hexDecimals.length % 2 !== 0) {
      hexDecimals = hexDecimals.padStart(hexDecimals.length + 1, '0');
    }

    const sanitizedAmount = token.amount.replace(/,/g, '');
    const amountBigInt = BigInt(
      new BigNumber(sanitizedAmount)
        .multipliedBy(new BigNumber(10).pow(token.decimals))
        .toFixed(0)
    );
    let hexAmount = amountBigInt.toString(16);
    if (hexAmount.length % 2 !== 0) {
      hexAmount = hexAmount.padStart(hexAmount.length + 1, '0');
    }

    const rolesHexParts = Object.entries(token.roles)
      .map(([roleName, isEnabled]) => {
        const hexRoleName = Buffer.from(roleName).toString('hex');
        const hexRoleValue = isEnabled ? '74727565' : '66616c7365';
        return `${hexRoleName}@${hexRoleValue}`;
      });

    const hexRoles = rolesHexParts.flat().join('@');
    const txData = `issue@${hexName}@${hexTicker}@${hexAmount}@${hexDecimals}@${hexRoles}`;

    const tx = new Transaction({
      data: new TransactionPayload(txData),
      gasLimit: 60_000_000,
      sender: address,
      receiver: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u',
      value: 50000000000000000,
      chainID: network.chainId
    });

    const sessionId = await sendAndSignTransactionsWrapped(
      [tx],
      transactionDisplayInfo({
        transactionName: 'Issue token',
        successTransactionName: 'Token created successfully'
      })
    );

    return sessionId;
  };

  return issueToken;
};
