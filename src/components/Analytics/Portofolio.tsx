import 'assets/scss/analytics.scss';
import ClipboardCopy from 'components/ClipboardCopy';
import { useGetAccountInfo } from 'hooks';
import { Col, Row } from 'react-bootstrap';
import PortofolioChart from 'components/Analytics/PortofolioChart';
import { PortofolioProps } from 'types/frontendTypes';
import PortofolioStats from 'components/Analytics/PortofolioStats';
import PortofolioRewardsStats from './PortofolioRewardsStats';

const Portofolio: React.FC<PortofolioProps> = ({ data, rewardsData, walletBalance, rewardsBalance }) => {
  const { address } = useGetAccountInfo();

  return (
    <>
      <h3 className='mt-5 text-white mb-1'>Your Portofolio</h3>
      {address && <p className='adress-text'><span className='address-copy-text'>Account: {address.slice(0, 5)} ... {address.slice(58, 62)} <ClipboardCopy text={address} /></span></p>}
      {address ? (
        <Row>
          <Col xs={12} lg={6}>
            <div className='portofolio-container' style={{ minHeight: '336px' }}>
              <Row>
                <Col xs={12} lg={7}>
                  <PortofolioStats data={data} balance={walletBalance} />
                </Col>
                <Col xs={12} lg={5}>
                  <PortofolioChart data={data} />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <PortofolioRewardsStats data={rewardsData} balance={rewardsBalance} />
          </Col>
        </Row >
      ) : (
        <div className='portofolio-container'>
          <p className='h5 text-silver mb-0 text-center mt-1'>Connect to see details</p>
        </div>
      )}
    </>
  );
};

export default Portofolio;