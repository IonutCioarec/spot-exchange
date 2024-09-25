import { routeNames } from 'routes/routes';
import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
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
  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  return (
    <>

      <Navbar
        expanded={expanded}
        collapseOnSelect
        expand="lg"
        className="pl-6 pr-6 pt-0 pb-0"
        style={{
          marginBottom: '0',
          minHeight: '52px',
          borderBottom: '2px solid #0c462f'
        }}
      >
        <Navbar.Brand as={Link} to={routeNames.home} className="pl-12 pr-4">
          <p className={`text-brand ml-2 mb-0 mt-0 ${isMobile ? '' : 'ml-8'}`}>DEX</p>
        </Navbar.Brand>
        {!isMobile && (
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            id="responsive-navbar-toggle"
            className="custom-toggler"
            onClick={handleToggle}
          />
        )}
        {!isMobile && (
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="text-up2 pr-5 pl-5 text-center"
          >
            <Nav className="text-center ml-auto" onSelect={handleSelect}>
              <Nav.Link
                as={Link}
                to="/"
                className={`mx-1 ${location.pathname === '/' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm">
                  <AnalyticsIcon className='nav-link-icon' />Dashboard
                </p>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/swap"
                className={`mx-1 ${location.pathname === '/swap' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm">
                  <SwapHorizIcon className='nav-link-icon' />Swap
                </p>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/pools"
                className={`mx-1 ${location.pathname === '/pools' ? 'active' : ''}`}
                onClick={handleSelect}
              >
                <p className="nav-link mb-0 mt-0 link font-size-sm">
                  <WorkspacesIcon className='nav-link-icon' />Pools
                </p>
              </Nav.Link>
            </Nav>
            <Nav className={`ml-auto ${isMobile ? '' : 'mr-12'}`} onSelect={handleSelect}>
              {!isLoggedIn ? (
                <Button
                  component={Link}
                  to="/unlock"
                  variant="contained"
                  size="medium"
                  color="success"
                  className="btn-green3 text-capitalize font-size-sm mb-0 mt-0"
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  size="medium"
                  color="success"
                  className="btn-green3 text-capitalize font-size-sm mb-0 mt-0"
                >
                  Disconnect
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        )}
        {isMobile && (
          <Navbar
            id="responsive-navbar-nav2"
            className="text-up2 pr-5 pl-5 text-center mr-5"
          >
            <Nav className={`ml-auto ${isMobile ? '' : 'mr-12'}`} onSelect={handleSelect}>
              {!isLoggedIn ? (
                <Button
                  component={Link}
                  to="/unlock"
                  variant="contained"
                  size="medium"
                  color="success"
                  className="btn-green3 text-capitalize font-size-sm mb-0 mt-0"
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  size="medium"
                  color="success"
                  className="btn-green3 text-capitalize font-size-sm mb-0 mt-0"
                >
                  Disconnect
                </Button>
              )}
            </Nav>
          </Navbar>
        )}
      </Navbar>
      {isMobile && (
        <div className="bottom-nav" style={{borderTop: '1px solid #1a9765'}}>
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