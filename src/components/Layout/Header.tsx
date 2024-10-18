import { routeNames, routes } from 'routes/routes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import 'assets/css/header.css';
import { useGetIsLoggedIn } from 'hooks';
import { logout } from 'helpers';
import { useMobile } from 'utils/responsive';
import 'assets/css/bottomNavbar.css';
import HomeIcon from '@mui/icons-material/Home';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PoolIcon from '@mui/icons-material/Pool'; // Custom pool icon representation
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Container } from 'react-bootstrap';
import logo from 'assets/img/logo_transparent_bg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Telegram, Facebook, X, MenuBook } from '@mui/icons-material';

export const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const callbackUrl = `${window.location.origin}/`;
  const onRedirect = undefined;
  const shouldAttemptReLogin = false;
  const options = {
    shouldBroadcastLogoutAcrossTabs: true,
    hasConsentPopup: false
  };

  const isLoggedIn = useGetIsLoggedIn();
  const handleLogout = () => {
    sessionStorage.clear();
    logout(callbackUrl, onRedirect, shouldAttemptReLogin, options);
  };

  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = (route: string) => {
    navigate(`/${route}`);
  };
  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  // Set the document title based on the current route
  useEffect(() => {
    const currentRoute = routes.find(route => route.path === location.pathname);
    if (currentRoute) {
      document.title = `Smart Exchange - ${currentRoute.title}`;
    } else {
      document.title = 'Smart Exchange';
    }
  }, [location]);

  return (
    <>
      <div className='header-area1'>
        <div className={`container d-flex justify-content-between align-items-center`}>
          <img
            src={logo}
            alt='logo'
            className='cursor-pointer'
            style={{ width: 50, height: 50 }}
            onClick={() => handleClick('')}
          />
          {!isMobile && (
            <p className='header-area1-text font-size-xxl mt-2 mb-0' onClick={() => handleClick('')}>Smart<span className='text-white'>Exchange</span></p>
          )}
          {!isLoggedIn ? (
            <Button
              component={Link}
              to="/unlock"
              className="btn-intense-green hover-btn"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              className="btn-intense-green hover-btn"
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
      {!isMobile && (
        <div className='header-area2'>
          <Navbar className='container'>
            <Nav>
              <Nav.Link
                as={Link}
                to="/"
                className={`mx-1 ${location.pathname === '/' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm m-l-n-xs">
                  Dashboard
                </p>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/swap"
                className={`mx-1 ${location.pathname === '/swap' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm">
                  Swap
                </p>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/pools"
                className={`mx-1 ${location.pathname === '/pools' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm">
                  Pools
                </p>
              </Nav.Link>
            </Nav>
            <Nav className='ml-auto'>
              <Nav.Link
                href='https://www.facebook.com'
                target='_blank'
                className='m-r-n-lg'
              >
                <Facebook className='nav-social-media-icon m-0' sx={{fontSize: '20px'}}/>
              </Nav.Link>
              <Nav.Link
                href='https://www.x.com'
                target='_blank'
                className='m-r-n-xl'
              >
                <X className='nav-social-media-icon' sx={{fontSize: '16px', marginTop: '2px'}}/>
              </Nav.Link>
              <Nav.Link
                href='https://www.telegram.com'
                target='_blank'
                className='m-r-n-lg'
              >
                <Telegram className='nav-social-media-icon m-0' sx={{fontSize: '20px'}}/>
              </Nav.Link>
              <Nav.Link
                href='https://www.telegram.com'
                target='_blank'
                className='m-r-n-lg'
              >
                <MenuBook className='nav-social-media-icon m-0' sx={{fontSize: '20px'}}/>
              </Nav.Link>
            </Nav>
          </Navbar>
        </div>
      )}
      {isMobile && (
        <div className="bottom-nav">
          <div className="nav-items">
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <AnalyticsIcon />
              <p className='mb-0'>Dashboard</p>
            </Link>
            <Link
              to="/swap"
              className={`nav-item ${location.pathname === '/swap' ? 'active' : ''}`}
            >
              <SwapHorizIcon />
              <p className='mb-0'>Swap</p>
            </Link>
            <Link
              to="/pools"
              className={`nav-item ${location.pathname === '/pools' ? 'active' : ''}`}
            >
              <WorkspacesIcon />
              <p className='mb-0'>Pools</p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};