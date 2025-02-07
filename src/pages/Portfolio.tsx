import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import UserPortfolio from 'components/Portfolio/UserPortfolio';
import TokenRow from 'components/Analytics/TokenRow';
import { useEffect, useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ContactsIcon from '@mui/icons-material/Contacts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import PaymentsIcon from '@mui/icons-material/Payments';
import { abbreviateNumber } from 'utils/formatters';
import { useGetAccountInfo, useGetIsLoggedIn, useGetAccountProvider } from 'hooks';
import { Navigate } from 'react-router-dom';
import XLogo from 'assets/img/xlogo.svg?react';
import { denominatedAmountToIntlFormattedAmount, intlNumberFormat } from 'utils/formatters';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LayersIcon from '@mui/icons-material/Layers';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import AnimationIcon from '@mui/icons-material/Animation';
import { CreatedTokens, UserNFTs } from 'types/mvxTypes';
import { useMvxAPI } from 'hooks/useMvxAPI';

const Portfolio = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { account, address } = useGetAccountInfo();
  const [userTokens, setUserTokens] = useState<CreatedTokens>({});
  const [userTokensCount, setUserTokensCount] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<UserNFTs>({});
  const [userNFTsCount, setUserNFTsCount] = useState<number>(0);
  const { getAllUserTokens, getAllUserNFTs } = useMvxAPI();

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
  };

  useEffect(() => {
    if(address){
      loadUserData();
    }
  }, [address]);

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

  // dex token details data
  const initialWalletRowItems = [
    { label: "Balance", value: denominatedAmountToIntlFormattedAmount(account.balance || 0, 18, 2) + ' EGLD', icon: <XLogo className="text-[rgb(90,214,121)]" />, isImage: false },
    { label: "Tokens", value: intlNumberFormat(userTokensCount ?? 0, 0, 0), icon: <AnimationIcon className='token-row-icon' />, isImage: false },
    { label: "NFTs", value: intlNumberFormat(userNFTsCount ?? 0, 0, 0), icon: <WallpaperIcon className='token-row-icon' />, isImage: false },
    { label: "Shard", value: 'Shard ' + (account.shard?.toString() || '0'), icon: <LayersIcon className='token-row-icon' />, isImage: false },
    { label: "Nonce", value: intlNumberFormat(account.nonce || 0, 0, 0), icon: <AccountBoxIcon className='token-row-icon' />, isImage: false },
  ];
  const [walletRowItems, setWalletwRowItems] = useState(initialWalletRowItems);

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

      {/* User portfolio */}
      <div>
        <UserPortfolio data={portfolioData} rewardsData={rewardsData} walletBalance={453.78} rewardsBalance={153.78} />
      </div>

      {/* DEX Token details animated row */}
      <div className='mt-5'>
        <TokenRow items={initialWalletRowItems} />
      </div>
    </div>
  );
}

export default Portfolio;