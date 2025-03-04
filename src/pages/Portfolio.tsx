import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import UserPortfolio from 'components/Portfolio/UserPortfolio';
import TokenRow from 'components/Analytics/TokenRow';
import { useEffect, useState } from 'react';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import XLogo from 'assets/img/xlogo.svg?react';
import { denominatedAmountToIntlFormattedAmount, getUserPoolsLiquidityTotal, intlNumberFormat } from 'utils/formatters';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LayersIcon from '@mui/icons-material/Layers';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AnimationIcon from '@mui/icons-material/Animation';
import { UserNFTs } from 'types/mvxTypes';
import { useMvxAPI } from 'hooks/useMvxAPI';
import UserTokensList from 'components/Portfolio/UserTokensList';
import UserPoolsList from 'components/Portfolio/UserPoolsList';
import { useDispatch, useSelector } from 'react-redux';
import { selectNonZeroBalanceLpTokenIds, selectUserLpTokens } from 'storeManager/slices/userTokensSlice';
import { useBackendAPI } from 'hooks/useBackendAPI';
import { PairsState } from 'types/backendTypes';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PaymentsIcon from '@mui/icons-material/Payments';
import { selectAllTokensById } from 'storeManager/slices/tokensSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { farmsDummy, userFarmsDummy } from 'utils/dummyData';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import UserFarmsList from 'components/Portfolio/UserFarmsList';
import { useMobile, useTablet } from 'utils/responsive';
import ScrollToTopButton from 'components/ScrollToTopButton';
import LightSpot from 'components/LightSpot';

const Portfolio = () => {
  const dispatch = useDispatch();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const { getTokens, getPairs } = useBackendAPI();
  const isLoggedIn = useGetIsLoggedIn();
  const { account, address } = useGetAccountInfo();
  const [userTokens, setUserTokens] = useState<any>({});
  const [userTokensCount, setUserTokensCount] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<UserNFTs>({});
  const [userNFTsCount, setUserNFTsCount] = useState<number>(0);
  const { getAllUserTokens, getAllUserNFTs } = useMvxAPI();
  const userLPTokens = useSelector(selectUserLpTokens);
  const [userPairs, setUserPairs] = useState<PairsState>({
    pairs: [],
    page: 1,
    limit: 50,
    total: 0,
    total_pages: 1,
    token_search: '',
    my_deposits: false,
    sort_by: 'liquidity',
    sort_direction: 'desc',
    lp_token_search: [],
    status: 'succeeded',
  });
  const lpSearchInput = useSelector(selectNonZeroBalanceLpTokenIds);
  const [userFees24h, setUserFees24h] = useState<Record<string, { balance: number }>>({});
  const [userFees7D, setUserFees7D] = useState<Record<string, { balance: number }>>({});
  const [userFees30D, setUserFees30D] = useState<Record<string, { balance: number }>>({});
  const [userFees, setUserFees] = useState<Record<string, { balance: number }>>({});
  const allTokens = useSelector(selectAllTokensById);


  // load the tokens created by the user through the api
  const loadUserData = async () => {
    const userTokensData = await getAllUserTokens(address);
    if (userTokensData && typeof userTokensData === 'object') {
      setUserTokensCount(Object.keys(userTokensData).length);
      setUserTokens(userTokensData);
    }

    const userNftsData = await getAllUserNFTs(address);
    if (userNftsData && typeof userNftsData === 'object') {
      setUserNFTsCount(Object.keys(userNftsData).length);
      setUserNFTs(userNftsData);
    }

    if (lpSearchInput && lpSearchInput.length > 0) {
      await getPairs(1, 50, 'liquidity', 'desc', '', true, lpSearchInput).then((r: any) => {
        setUserPairs(r);
      });
    }
  };

  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address, lpSearchInput]);

  // user portfolio data
  const portfolioData = [
    { name: 'Tokens', value: 300.78 },
    { name: 'Pools', value: 100 },
    { name: 'Farms', value: 153 },
  ];

  // user rewards portfolio data
  const rewardsData = [
    { name: 'Fees', value: 84.36 },
    { name: 'Boosted Farms', value: 26.07 }
  ];

  // user wallet details data
  const initialWalletRowItems = [
    { label: "Balance", value: denominatedAmountToIntlFormattedAmount(account.balance || 0, 18, 2) + ' EGLD', icon: <XLogo className="text-[rgb(90,214,121)]" />, isImage: false },
    { label: "Tokens", value: intlNumberFormat(userTokensCount ?? 0, 0, 0), icon: <AnimationIcon className='token-row-icon' />, isImage: false },
    { label: "NFTs", value: intlNumberFormat(userNFTsCount ?? 0, 0, 0), icon: <WallpaperIcon className='token-row-icon' />, isImage: false },
    { label: "Shard", value: 'Shard ' + (account.shard?.toString() || '0'), icon: <LayersIcon className='token-row-icon' />, isImage: false },
    { label: "Nonce", value: intlNumberFormat(account.nonce || 0, 0, 0), icon: <AccountBoxIcon className='token-row-icon' />, isImage: false },
  ];
  const [walletRowItems, setWalletRowItems] = useState(initialWalletRowItems);


  // user pools details data
  const initialPoolsRowItems = [
    { label: "Your Pools", value: userPairs?.pairs.length.toString(), icon: <WorkspacesIcon className="token-row-icon" />, isImage: false },
    { label: "Total Liquidity", value: '$' + getUserPoolsLiquidityTotal(userPairs.pairs, userLPTokens, allTokens), icon: <PaymentsIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (24h)", value: '$' + intlNumberFormat(Object.values(userFees24h).reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0, 2, 2), icon: <AccessTimeIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (7D)", value: '$' + intlNumberFormat(Object.values(userFees7D).reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0, 2, 2), icon: <CalendarTodayIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (30D)", value: '$' + intlNumberFormat(Object.values(userFees30D).reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0, 2, 2), icon: <DateRangeIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees", value: '$' + intlNumberFormat(Object.values(userFees).reduce((sum, item) => sum + (item.balance || 0), 0) ?? 0, 2, 2), icon: <MonetizationOnIcon className='token-row-icon' />, isImage: false },
  ];
  const [poolsRowItems, setPoolsRowItems] = useState(initialPoolsRowItems);

  // user pools details data
  const initialFarmsRowItems = [
    { label: "Your Farms", value: Object.values(farmsDummy).length.toString(), icon: <AgricultureIcon className="token-row-icon" />, isImage: false },
    { label: "Total Staked", value: '$' + intlNumberFormat(Object.values(userFarmsDummy).reduce((sum, item) => sum + (Number(item.staked) || 0), 0) ?? 0, 2, 2), icon: <AccountBalanceIcon className='token-row-icon' />, isImage: false },
    { label: "Total Rewards", value: '$' + intlNumberFormat(Object.values(userFarmsDummy).reduce((sum, item) => sum + (Number(item.rewards) || 0), 0) ?? 0, 2, 2), icon: <CardGiftcardIcon className='token-row-icon' />, isImage: false },
    { label: "Highest Staked", value: '$' + intlNumberFormat(Math.max(...Object.values(userFarmsDummy).map(farm => parseFloat(farm.staked) || 0)), 2, 2), icon: <TrendingUpIcon className='token-row-icon' />, isImage: false },
    { label: "Highest Reward", value: '$' + intlNumberFormat(Math.max(...Object.values(userFarmsDummy).map(farm => parseFloat(farm.rewards) || 0)), 2, 2), icon: <EmojiEventsIcon className='token-row-icon' />, isImage: false },
  ];
  const [farmsRowItems, setFarmsRowItems] = useState(initialFarmsRowItems);

  return (
    <div className="analytics-page-height mb-5">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Portfolio</h2>
              <p className='text-white text-justified mb-0'>Monitor and manage your crypto assets effortlessly with real-time tracking and analytics</p>
            </div>
          </div>
        </Col>
      </Row>
      {isMobile && (
        <ScrollToTopButton targetRefId='topSection' />
      )}

      {/* User portfolio */}
      <div>
        <UserPortfolio data={portfolioData} rewardsData={rewardsData} walletBalance={453.78} rewardsBalance={153.78} />
      </div>

      {/* User wallet details animated row */}
      <div className='mt-5'>
        <TokenRow items={initialWalletRowItems} />
      </div>

      {/* User Tokens List */}
      <div className='mt-5' id="TokensSection">
        <UserTokensList tokens={userTokens} />
      </div>

      {/* User pools details animated row */}
      <div className='mt-5'>
        <TokenRow items={initialPoolsRowItems} />
      </div>

      {/* User Pools List */}
      <div className='mt-5' id="PoolsSection">
        <UserPoolsList
          pairs={userPairs}
          userLpTokenBalance={userLPTokens}
          userFees24h={userFees24h}
        />
      </div>

      {/* User farms details animated row */}
      <div className='mt-5'>
        <TokenRow items={initialFarmsRowItems} />
      </div>

      {/* User Farms List */}
      <div className='mt-5' id="FarmsSection">
        <UserFarmsList
          farms={farmsDummy}
          userData={userFarmsDummy}
        />
      </div>

      {/* Add light spots */}
      <LightSpot size={isMobile ? 220 : 350} x={isMobile ? '25%' : '40%'} y="40%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Portfolio;
