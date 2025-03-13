import { Container } from 'react-bootstrap';
import 'assets/scss/farms.scss';
import { Row, Col } from 'react-bootstrap';
import Farm from 'components/Farms/Farm';
import { poolBaseTokens } from 'config';
import { intlFormatSignificantDecimals } from 'utils/formatters';
import LightSpot from 'components/LightSpot';
import { useMobile } from 'utils/responsive';
import { Button, FormControlLabel, styled, Switch, TextField } from '@mui/material';
import { useGetAccountInfo } from 'hooks';
import { Search } from '@mui/icons-material';
import { Fragment, useState } from 'react';
import ScrollToTopButton from 'components/ScrollToTopButton';
import { farmsDummy, userFarmsDummy } from 'utils/dummyData';
import { isEmpty } from '@multiversx/sdk-core/out';
import FilterLoader from 'components/Pools/FilterLoader';
import { Farm as FarmType } from 'types/backendTypes';
import { ChevronLeft, ChevronRight, KeyboardDoubleArrowRight, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { FarmItem } from 'components/Farms/FarmItem';

const Farms = () => {
  const isMobile = useMobile();
  const { address } = useGetAccountInfo();
  const isLoggedIn = address ? true : false;
  const [localSearchInput, setLocalSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const currentPage = 1;
  const totalPages = 1;
  const handlePageChange = (newPage: number) => {
    //
  };
  const sortBy = 'total_staked';
  const sortDirection = 'desc';

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
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ minHeight: '60px' }}>
            {/* <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '60px' }}> */}
            <div className={`p-3  ${isMobile ? 'mt-2' : 'mt-5'}`}>
              <h2 className='text-white text-center'>Farms</h2>
            </div>
          </div>
        </Col>
      </Row>
      {isMobile && Object.values(farmsDummy).length && (
        <ScrollToTopButton targetRefId='topSection' />
      )}

      <div className='d-flex justify-content-end align-items-center mt-2'>
        <FormControlLabel
          control={
            <CustomSwitch
            />
          }
          label="My Farms"
          labelPlacement="end"
          sx={{
            width: isMobile ? '50%' : 'auto',
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

      {(isEmpty(farmsDummy)) && (
        <div>
          <div className='flex flex-col p-3 items-center justify-center gap-2 rounded-lg pool'>
            <div className='flex flex-col items-center'>
              <p className='text-white mb-0 font-bold'>No Farms Found</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <FilterLoader />
      ) : (
        <Fragment>
          {Object.values(farmsDummy).map((farm: FarmType, index: number) => (
            <FarmItem
              farm={farm}
              userFarm={userFarmsDummy[farm.lp_token_id]}
              index={index + (currentPage-1)  * 10}
              sortBy={sortBy}
              sortDirection={sortDirection}
              key={farm.lp_token_id}
            />
          ))}
          <div className="pagination-controls mb-5">
            <Button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className='pagination-button'
            >
              <KeyboardDoubleArrowLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
            </Button>

            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='pagination-button'
            >
              <ChevronLeft className={`${currentPage === 1 ? 'disabled-arrow' : 'active-arrow'}`} />
            </Button>

            <span>
              Page {currentPage} {totalPages > 0 ? `of ${totalPages}` : 'of 1'}
            </span>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='pagination-button'
            >
              <ChevronRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`} />
            </Button>

            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className='pagination-button'
            >
              <KeyboardDoubleArrowRight className={`${currentPage === totalPages ? 'disabled-arrow' : 'active-arrow'}`} />
            </Button>
          </div>
        </Fragment>
      )}

      <LightSpot size={isMobile ? 220 : 360} x={isMobile ? '25%' : '40%'} y="36%" color="rgba(63, 172, 90, 0.3)" intensity={1} />
    </div>
  );
}

export default Farms;