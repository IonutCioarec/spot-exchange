import { Fragment, useEffect, useRef, useState } from 'react';
import { formatNumberWithCommas, intlNumberFormat } from 'utils/formatters';
import { useMobile, useTablet } from 'utils/responsive';
import { Button, FormControlLabel, IconButton, styled, Switch, TextField } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import { useGetAccountInfo, useGetIsLoggedIn, useGetLoginInfo } from 'hooks';
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
import { useBackendAPI } from 'hooks/useBackendAPI';
import { CheckBrandingPRResponse } from 'types/backendTypes';
import InfoIcon from '@mui/icons-material/Info';

const PR_CHECK_COOLDOWN = 10 * 60 * 1000;
const STORAGE_KEY = 'pr_check_data';

interface StoredPRData {
  timestamp: number;
  prStatus: CheckBrandingPRResponse;
}

const OwnedTokens = ({ open, setOpen }: { open: boolean, setOpen: Function }) => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const isLoggedIn = useGetIsLoggedIn();

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

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && containerRef.current && isMobile) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [open]);

  // check is the user has any in-progress pull request and display it
  const { tokenLogin } = useGetLoginInfo();
  const { checkBrandingPR } = useBackendAPI();
  const [prStatus, setPRStatus] = useState<CheckBrandingPRResponse>();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Format time remaining as MM:SS
  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const loadstatusData = async () => {
    if (tokenLogin?.nativeAuthToken && address) {
      const newData = await checkBrandingPR(tokenLogin?.nativeAuthToken || '');
      setPRStatus(newData);
    }
  }

  // Load data from localStorage or fetch new data
  const loadStatusData = async (forceFetch: boolean = false) => {
    if (!tokenLogin?.nativeAuthToken || !address) {
      return;
    }

    // Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !forceFetch) {
      const { timestamp, prStatus: storedStatus }: StoredPRData = JSON.parse(stored);
      const now = Date.now();
      const timeSinceCheck = now - timestamp;

      if (timeSinceCheck < PR_CHECK_COOLDOWN) {
        setPRStatus(storedStatus);
        setTimeRemaining(PR_CHECK_COOLDOWN - timeSinceCheck);
        return;
      } else {
        // Clear expired data
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Fetch new data
    try {
      const newData = await checkBrandingPR(tokenLogin.nativeAuthToken);
      setPRStatus(newData);
      const timestamp = Date.now();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timestamp, prStatus: newData })
      );
      setTimeRemaining(PR_CHECK_COOLDOWN);
    } catch (error) {
      console.error('Error fetching PR status:', error);
      setPRStatus({ status: 'failed', error: 'Failed to check PR status' });
    }
  };

  // Load data on mount or address change
  useEffect(() => {
    if (address) {
      loadStatusData();
    }
  }, [address]);

  // Update countdown every second
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1000) {
          clearInterval(interval);
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Handle refresh button click
  const handleRefresh = () => {
    if (timeRemaining === null || timeRemaining <= 0) {
      loadStatusData(true); // Force fetch
    }
  };

  return (
    <div ref={containerRef}>
      <motion.div
        style={{ overflow: 'hidden' }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className='b-r-sm'
      >
        <div className={`create-token-container p-4 tool-active`}>
          <div className={`cursor-pointer tools-title d-flex justify-content-between align-items-center mb-5 px-4 pt-3`} onClick={() => setOpen(!open)}>
            <p className={`h5 text-white mx-auto text-center mb-0`}>Branding Token</p>
            {open ? <KeyboardArrowUpIcon fontSize='large' style={{ color: 'white' }} /> : <KeyboardArrowDownIcon fontSize='large' className='mb-2' style={{ color: 'white' }} />}
          </div>
          {(prStatus && prStatus?.prs?.length) ? (
            (prStatus?.prs[0].prInProgress && (
              <Fragment>
                <div className={`p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} justify-content-between align-items-center mb-5`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                  <InfoIcon fontSize='medium' color='info' />
                  <p className='font-size-xs text-justified mb-0 mt-0 mx-3'>You have a branding request in progress for token {prStatus?.prs[0].token_id}. You can only have one branding request in progress at a time!</p>
                  <Button
                    onClick={handleRefresh}
                    disabled={timeRemaining !== null && timeRemaining > 0}
                    className={`btn-intense-default btn-intense-info small font-size-xxs b-r-sm hover-btn text-white`}
                    sx={{ height: (timeRemaining !== null && timeRemaining > 0) ? '44px' : '24px', minWidth: isMobile ? '170px' : '80px', whiteSpace: 'collapse' }}
                  >
                    {timeRemaining !== null && timeRemaining > 0
                      ? `Refresh in ${formatTimeRemaining(timeRemaining)}`
                      : 'Refresh'}
                  </Button>
                </div>
              </Fragment>
            ))
          ) : (
            <Fragment>
              <div className={`p-3 b-r-sm text-silver ${isMobile ? '' : 'd-flex'} justify-content-between align-items-center mb-5`} style={{ backgroundColor: 'rgba(10,10,10,0.7)' }}>
                <InfoIcon fontSize='medium' color='info' />
                <p className='font-size-xs text-justified mb-0 mt-0 mx-3'>You have no branding requests. You can only have one branding request in progress at a time!</p>
              </div>
            </Fragment>
          )}
          {(isLoggedIn && Object.values(createdTokens).length) && (
            <p className='text-silver font-size-md'>These are the tokens you are the owner for:</p>
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
                      state={{ token: createdTokens[token.token_id] }}
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
                      state={{ token: createdTokens[token.token_id] }}
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
        </div>
      </motion.div>
    </div>
  );
};

export default OwnedTokens;