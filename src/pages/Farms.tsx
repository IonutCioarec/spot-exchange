import { Container } from 'react-bootstrap';
import 'assets/scss/farms.scss';
import { Row, Col } from 'react-bootstrap';
import Farm from 'components/Farms/Farm';
import { poolBaseTokens } from 'config';
import { intlFormatSignificantDecimals } from 'utils/formatters';
import LightSpot from 'components/LightSpot';
import { useMobile } from 'utils/responsive';
import { FormControlLabel, styled, Switch, TextField } from '@mui/material';
import { useGetAccountInfo } from 'hooks';
import { Search } from '@mui/icons-material';
import { useState } from 'react';

const Farms = () => {
  const isMobile = useMobile();
  const { address } = useGetAccountInfo();
  const isLoggedIn = address ? true : false;
  const [localSearchInput, setLocalSearchInput] = useState<string>('');


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchInput(value);
  };

  const CustomSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-switchBase': {
      transitionDuration: '300ms',
      '&.Mui-checked': {
        color: '#3FAC5A',
        '& + .MuiSwitch-track': {
          backgroundColor: 'transparent',
          border: '1px solid #3FAC5A',
        },
        '& + .MuiSwitch-thumb': {
          backgroundColor: '#3FAC5A',
        },
      },
      '&.Mui-disabled': {
        color: 'silver',
        '& + .MuiSwitch-track': {
          backgroundColor: 'transparent',
          border: '1px solid silver',
        },
        '& + .MuiSwitch-thumb': {
          backgroundColor: 'silver',
        },
      },
    },
    '& .MuiSwitch-track': {
      borderRadius: 10,
      backgroundColor: 'transparent',
      border: '1px solid #3FAC5A',
      height: isMobile ? 12 : 16,
      width: isMobile ? 32 : 34,
      margin: 'auto',
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: isMobile ? 8 : 10,
      height: isMobile ? 8 : 10,
      margin: isMobile ? 6 : 5,
    },
  }));

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

      <div className='d-flex justify-content-end align-items-center mt-2'>
        <FormControlLabel
          control={
            <CustomSwitch
            />
          }
          label="My Deposits"
          labelPlacement="end"
          sx={{
            width: '50%',
            color: isLoggedIn ? 'white' : 'silver',
            fontSize: '14px',
            '& .MuiTypography-root': {
              fontSize: isMobile ? '14px' : '16px',
              fontFamily: 'Red Rose',
              color: !isLoggedIn ? 'silver' : 'white'
            },
          }}
        />
        <TextField
          id="outlined-search"
          type="search"
          size="small"
          className="ms-2 mb-2"
          value={localSearchInput}
          autoComplete="off"
          onChange={handleSearchChange}
          InputProps={{
            style: {
              backgroundColor: 'rgba(63, 63, 63, 0.4)',
              color: 'white',
              borderRadius: '20px'
            },
            startAdornment: (
              <Search style={{ color: 'white', marginRight: '8px', fontSize: '16px' }} />
            ),
          }}
          InputLabelProps={{
            style: {
              color: 'white',
              marginTop: '3px'
            },
          }}
          sx={{
            '& .MuiInputBase-input': {
              height: '0.95em',
              fontSize: '0.95em',
            },
            '& .MuiOutlinedInput-root': {
              height: 'auto',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3FAC5A',
              },
              '&:hover fieldset': {
                borderColor: '#3FAC5A',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            }
          }}
        />
      </div>

      <Row className='mb-5'>
        <Col lg={3} className='mt-2 mb-3'>
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
        <Col lg={3} className='mt-2 mb-3'>
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
        <Col lg={3} className='mt-2 mb-3'>
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
        <Col lg={3} className='mt-2 mb-5'>
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

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Farms;