import 'assets/scss/analytics.scss';
import ClipboardCopy from 'components/ClipboardCopy';
import { useGetAccountInfo } from 'hooks';
import { Col, Row } from 'react-bootstrap';
import PortfolioChart from 'components/Analytics/PortfolioChart';
import { PortfolioProps } from 'types/frontendTypes';
import PortfolioStats from 'components/Analytics/PortfolioStats';
import PortfolioRewardsStats from './PortfolioRewardsStats';
import { useMobile } from 'utils/responsive';

const UserPortfolio: React.FC<PortfolioProps> = ({ data, rewardsData, walletBalance, rewardsBalance }) => {
  const { address } = useGetAccountInfo();
  const isMobile = useMobile();

  return (
    <>
      <h3 className='mt-5 text-white mb-1'>Your Portfolio</h3>
      {address && <p className='adress-text'><span className='address-copy-text'>Account: {address.slice(0, 5)} ... {address.slice(58, 62)} <ClipboardCopy text={address} /></span></p>}
      {address ? (
        <Row>
          <Col xs={12} lg={6}>
            <div className='portfolio-container' style={{ minHeight: '336px' }}>
              <Row>
                <Col xs={12} lg={7}>
                  <PortfolioStats data={data} balance={walletBalance} />
                </Col>
                <Col xs={12} lg={5}>
                  <PortfolioChart data={data} />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12} lg={6} className={`${isMobile ? 'mt-4' : ''}`}>
            <PortfolioRewardsStats data={rewardsData} balance={rewardsBalance} />
          </Col>
        </Row>
      ) : (
        <div className='portfolio-container'>
          <p className='h5 text-silver mb-0 text-center mt-1'>Connect to see details</p>
        </div>
      )}
    </>
  );
};

export default UserPortfolio;