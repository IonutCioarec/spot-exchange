import { Fragment, useEffect, useState } from 'react';
import { formatNumberWithCommas, intlNumberFormat } from 'utils/formatters';
import { useMobile, useTablet } from 'utils/responsive';
import { Button, FormControlLabel, IconButton, styled, Switch, TextField } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomTooltip from 'components/CustomTooltip';
import { CreatedToken, CreatedTokens } from 'types/mvxTypes';
import { useMvxAPI } from 'hooks/useMvxAPI';
import LanguageIcon from '@mui/icons-material/Language';
import { network } from 'config';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const OwnedTokens = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const isLoggedIn = useGetIsLoggedIn();

  const [open, setOpen] = useState(false);
  const [createdTokens, setCreatedTokens] = useState<CreatedTokens>({});
  const { getUserCreatedTokens } = useMvxAPI();

  // load the tokens created by the user through the api
  const loadCreatedTokens = async () => {
    if (address) {
      const userTokens = await getUserCreatedTokens(address);
      setCreatedTokens(userTokens);
    }
  };

  useEffect(() => {
    loadCreatedTokens();
  }, [address]);

  return (
    <div>
      <div className={`create-token-container mb-2 ${open ? 'tool-active' : ''}`}>
        <div className={`cursor-pointer tools-title d-flex justify-content-between align-items-center ${open ? 'px-4 pt-3' : 'px-4 pt-2'}`} onClick={() => setOpen(!open)}>
          <p className={`h5 text-white ${open ? 'mx-auto text-center mb-0' : 'mb-2'}`}>Branding Token</p>
          {open ? <KeyboardArrowUpIcon fontSize='large' style={{ color: 'white' }} /> : <KeyboardArrowDownIcon fontSize='large' className='mb-2' style={{ color: 'white' }} />}
        </div>
        <motion.div
          style={{ overflow: 'hidden' }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          className={open ? 'p-4' : ''}
        >
          {(isLoggedIn && Object.values(createdTokens).length) && (
            <p className='mt-2 text-silver font-size-md'>These are the tokens you are the owner for:</p>
          )}
          {Object.values(createdTokens).map((token: CreatedToken) => (
            <div key={`created-token-${token.token_id}`} className='text-silver'>
              <hr className='my-3' style={{ opacity: '0.3', color: 'green' }} />
              <Row className='d-flex align-items-center'>
                <Col xs={3} lg={2}>
                  <img
                    src={token.logo}
                    alt={token.token_id}
                    style={{ width: isMobile ? 55 : 50, height: isMobile ? 55 : 50, flexShrink: 0 }}
                    className='me-1'
                  />
                </Col>
                <Col xs={9} lg={7}>
                  <div className={`${isMobile ? '' : 'm-l-n-md me-3'}`}>
                    <p className='mb-0 text-white'>
                      {token.token_id}
                      <span
                        onClick={() => window.open(`${network.explorerAddress}/tokens/${token.token_id}`, '_blank', 'noopener,noreferrer')}
                        className="cursor-pointer text-silver"
                      >
                        <ArrowOutwardIcon className="ms-1" style={{ fontSize: '16px', marginTop: '-1px' }} />
                      </span>
                    </p>
                    <p className='font-size-xs text-justified mb-0'>{token?.assets?.description}</p>
                  </div>
                </Col>
                {!isMobile && (
                  <Col xs={12} lg={3}>
                    <Button
                      component={Link}
                      to={`/token-assets/${token.token_id}`}
                      state={{ createdTokens }}
                      className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth`}
                      sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
                    >
                      {token.branded ? 'Update Assets' : 'Set Assets'}
                    </Button>
                  </Col>
                )}
              </Row>
              {isMobile && (
                <Row>
                  <Col xs={12}>
                    <Button
                      component={Link}
                      to={`/token-assets/${token.token_id}`}
                      state={{ createdTokens }}
                      className={`btn-intense-default btn-intense-success2 smaller font-size-xxs b-r-sm hover-btn text-white fullWidth mt-3`}
                      sx={{ height: '30px', minWidth: isMobile ? '170px' : '100px' }}
                    >
                      {token.branded ? 'Update Assets' : 'Set Assets'}
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          ))}
          {!isLoggedIn && (
            <p className='text-white mb-0'>
              <span
                className='active-title cursor-pointer'
                onClick={() => navigate('/unlock')}
              >
                Connect wallet
              </span> to see your tokens
            </p>
          )}
          {(isLoggedIn && Object.values(createdTokens).length == 0) && (
            <p className='text-silver font-size-md m-t-n-md'>No created tokens? Create one token using the <span className='text-[#3FAC5A]'>Issue Token</span> section and come back</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OwnedTokens;