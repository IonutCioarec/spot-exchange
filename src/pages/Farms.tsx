import { Container } from 'react-bootstrap';
import 'assets/scss/farms.scss';
import { Row, Col } from 'react-bootstrap';
import Farm from 'components/Farms/Farm';
import { poolBaseTokens } from 'config';
import { intlFormatSignificantDecimals } from 'utils/formatters';

const Farms = () => {
  return (
    <div className='farms-page-height'>
      <Row>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Farms</h2>
              <p className='text-white mb-0'>Stake your tokens in following farms and earn great rewards</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row >
        <Col lg={3} className='mt-4'>
          <Farm
            title='EGLDPRIZE'
            cardImage={1}
            subContainerBg='rgba(20,20,20, 0.8)'
            imageToken1={poolBaseTokens.token1.image}
            imageToken2={poolBaseTokens.token3.image}
            totalAPR={30.25}
            feesAPR={20.21}
            boostedAPR={10.05}
            totalStaked={1888999.23}
            totalRewards={1987.29}
            stakingUsers='234'
            userStake={17324.79}
            userRewards={123}
            userLpTokenBalance={323.87}
            lpTokenId='EGLDPRIZE-4a453'
          />
        </Col>
        <Col lg={3} className='mt-4'>
          <Farm
            title='PRIZEEGLD'
            cardImage={1}
            subContainerBg='rgba(20,20,20, 0.8)'
            imageToken1={poolBaseTokens.token3.image}
            imageToken2={poolBaseTokens.token1.image}
            totalAPR={30.25}
            feesAPR={20.21}
            boostedAPR={10.05}
            totalStaked={1888999.23}
            totalRewards={1987.29}
            stakingUsers='234'
            userStake={17324.79}
            userRewards={123}
            userLpTokenBalance={60}
            lpTokenId='PRIZEEGLD-4a453'
          />
        </Col>
        <Col lg={3} className='mt-4'>
          <Farm
            title='USDCEGLD'
            cardImage={1}
            subContainerBg='rgba(20,20,20, 0.8)'
            imageToken1={poolBaseTokens.token2.image}
            imageToken2={poolBaseTokens.token1.image}
            totalAPR={30.25}
            feesAPR={20.21}
            boostedAPR={10.05}
            totalStaked={1888999.23}
            totalRewards={1987.29}
            stakingUsers='234'
            userStake={17324.79}
            userRewards={123}
            userLpTokenBalance={323.87}
            lpTokenId='USDCEGLD-4a453'
          />
        </Col>
        <Col lg={3} className='mt-4'>
          <Farm
            title='USDCPRIZE'
            cardImage={1}
            subContainerBg='rgba(20,20,20, 0.8)'
            imageToken1={poolBaseTokens.token2.image}
            imageToken2={poolBaseTokens.token3.image}
            totalAPR={30.25}
            feesAPR={20.21}
            boostedAPR={10.05}
            totalStaked={1888999.23}
            totalRewards={1987.29}
            stakingUsers='234'
            userStake={17324.79}
            userRewards={123}
            userLpTokenBalance={323.87}
            lpTokenId='USDCPRIZE-4a453'
          />
        </Col>
      </Row>
    </div>
  );
}

export default Farms;