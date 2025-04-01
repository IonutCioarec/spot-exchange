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
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BadgeIcon from '@mui/icons-material/Badge';
import { Container } from 'react-bootstrap';
import logo from 'assets/img/logo.png';
import fullLogo from 'assets/img/logo_with_text.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Telegram, Facebook, X, MenuBook } from '@mui/icons-material';
import LightLine from 'components/LightLine';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SecurityIcon from '@mui/icons-material/Security';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

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
      document.title = `Spot Exchange - ${currentRoute.title}`;
    } else {
      document.title = 'Spot Exchange';
    }
  }, [location]);

  return (
    <>
      <div className='header-area2'>
        <div className='d-flex py-2 justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <img
              src={fullLogo}
              alt='fullLogo'
              className='cursor-pointer'
              style={{ height: isMobile ? 200 : 245, marginTop: '-100px', marginBottom: '-100px' }}
              onClick={() => handleClick(isLoggedIn ? 'portfolio' : '')}
            />            
          </div>
          <div>
            {!isMobile && (
              <Navbar>
                <Nav>
                  {isLoggedIn && (
                    <Nav.Link
                      as={Link}
                      to="/portfolio"
                      className={`mx-1 ${location.pathname === '/portfolio' ? 'active' : ''}`}
                      onClick={handleSelect}
                    >
                      <p className="nav-link mb-0 mt-0 link font-size-sm m-l-n-xs">
                        Portfolio
                      </p>
                    </Nav.Link>
                  )}
                  <Nav.Link
                    as={Link}
                    to="/"
                    className={`mx-1 ${(location.pathname === '/' || location.pathname === '/swap') ? 'active' : ''}`}
                    onClick={handleSelect}
                  >
                    <p className="nav-link mb-0 mt-0 link font-size-sm m-l-n-xs">
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
                  <Nav.Link
                    as={Link}
                    to="/farms"
                    className={`mx-1 ${location.pathname === '/farms' ? 'active' : ''}`}
                    onClick={handleSelect}
                  >
                    <p className="nav-link mb-0 mt-0 link font-size-sm">
                      Farms
                    </p>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/analytics"
                    className={`mx-1 ${location.pathname === '/analytics' ? 'active' : ''}`}
                    onClick={handleSelect}
                  >
                    <p className="nav-link mb-0 mt-0 link font-size-sm">
                      Analytics
                    </p>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin-operations"
                    className={`mx-1 ${location.pathname === '/admin-operations' ? 'active' : ''}`}
                    onClick={handleSelect}
                  >
                    <p className="nav-link mb-0 mt-0 link font-size-sm">
                      Admin
                    </p>
                  </Nav.Link>
                </Nav>

              </Navbar>
            )}
          </div>
          <div className='mr-3'>
            {!isLoggedIn ? (
              <Button
                component={Link}
                to="/unlock"
                className="btn-intense-default btn-intense-success2 hover-btn b-r-md"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                className="btn-intense-default btn-intense-success2 hover-btn b-r-md"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="bottom-nav">
          <div className="nav-items">
            {isLoggedIn && (
              <Link to="/portfolio" className={`nav-item ${location.pathname === '/portfolio' ? 'active' : ''}`}>
                <FolderSpecialIcon />
                <p className='mb-0'>Portfolio</p>
              </Link>
            )}
            <Link to="/" className={`nav-item ${(location.pathname === '/' || location.pathname === '/swap') ? 'active' : ''}`}>
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
            <Link
              to="/farms"
              className={`nav-item ${location.pathname === '/farms' ? 'active' : ''}`}
            >
              <AgricultureIcon />
              <p className='mb-0'>Farms</p>
            </Link>
            <Link
              to="/analytics"
              className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}
            >
              <AnalyticsIcon />
              <p className='mb-0'>Analytics</p>
            </Link>
            <Link
              to="/admin-operations"
              className={`nav-item ${location.pathname === '/admin-operations' ? 'active' : ''}`}
            >
              <SecurityIcon />
              <p className='mb-0'>Admin</p>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};