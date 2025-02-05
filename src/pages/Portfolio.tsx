import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import Portofolio from 'components/Analytics/Portofolio';
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
import { useGetIsLoggedIn } from 'hooks';
import { Navigate } from 'react-router-dom';

const Portfolio = () => {
  const isLoggedIn = useGetIsLoggedIn();
  
  // user portofolio data
  const portofolioData = [
    { name: 'Tokens', value: 300.78 },
    { name: 'Pools', value: 100 },
    { name: 'Farms', value: 153 },
  ];

  // user rewards portofolio data
  const rewardsData = [
    { name: 'Fees', value: 84.36 },
    { name: 'Boosted Farms', value: 26.07 },
    { name: 'Farms', value: 43.35 },
  ];

  // dex token details data
  const initialTokenRowItems = [
    { label: "DEX Token", value: "XTICKET", icon: "https://tools.multiversx.com/assets-cdn/devnet/tokens/XTICKET-6e9b83/icon.svg", isImage: true },
    { label: "Minted", value: "100M", icon: <AccountTreeIcon className='token-row-icon' />, isImage: false },
    { label: "Burned", value: "10.5M", icon: <LocalFireDepartmentIcon className='token-row-icon' />, isImage: false },
    { label: "Supply", value: "89.5M", icon: <RecyclingIcon className='token-row-icon' />, isImage: false },
    { label: "Holders", value: "124", icon: <ContactsIcon className='token-row-icon smaller' />, isImage: false },
    { label: "Price", value: "$1,34", icon: <AttachMoneyIcon className='token-row-icon' style={{ marginRight: '-10px' }} />, isImage: false },
    { label: "Volume 24h", value: "$10,345", icon: <TimelineIcon className='token-row-icon' />, isImage: false },
    { label: "Liquidity", value: "$100,345", icon: <PaymentsIcon className='token-row-icon' />, isImage: false },
    { label: "Transactions", value: "10,345", icon: <SwapHorizontalCircleIcon className='token-row-icon' />, isImage: false },
  ];
  const [tokenRowItems, setTokenRowItems] = useState(initialTokenRowItems);


  // navigate to swap page is the use is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/swap" replace />;
  }

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

      {/* User portofolio */}
      <div>
        <Portofolio data={portofolioData} rewardsData={rewardsData} walletBalance={453.78} rewardsBalance={153.78} />
      </div>

      {/* DEX Token details animated row */}
      <div className='mt-5'>
        <TokenRow items={tokenRowItems} />
      </div>
    </div>
  );
}

export default Portfolio;