
import { routeNames } from 'routes/routes';
import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import { Button } from '@mui/material';
import 'assets/css/header.css';
import { useGetIsLoggedIn } from 'hooks'
import { logout } from 'helpers';
import {useMobile} from 'utils/responsive';


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
    logout(
      callbackUrl,
      onRedirect,
      shouldAttemptReLogin,
      options
    );
  };

  const isMobile = useMobile();
  const location = useLocation();
  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  return (
    <>
      <Navbar expanded={expanded} collapseOnSelect expand="lg" className="pl-6 pr-6 pt-2 pb-2" style={{ marginBottom: '0', minHeight: '72px', borderBottom: '1px solid #01b574' }}>
        <Navbar.Brand as={Link} to={routeNames.home} className='pl-12 pr-4'>
          <p className={`text-brand ml-2 mb-0 mt-0 ${isMobile ? '' : 'ml-8'}`}>DEX</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" id='responsive-navbar-toggle' className="custom-toggler" onClick={handleToggle} />
        <Navbar.Collapse id="responsive-navbar-nav" className='text-up2 pr-5 pl-5 text-center'>
          <Nav className='text-center ml-auto' onSelect={handleSelect}>
            <Nav.Link as={Link} to="/" className={`mx-1 ${location.pathname === '/' ? 'active' : ''}`} onClick={handleSelect}>
              <p className='nav-link mb-0 mt-0 link'>Home</p>
            </Nav.Link>
            <Nav.Link as={Link} to="/swap" className={`mx-1 ${location.pathname === '/swap' ? 'active' : ''}`} onClick={handleSelect}>
              <p className='nav-link mb-0 mt-0 link'>Swap</p>
            </Nav.Link>
            <Nav.Link as={Link} to="/pools" className={`mx-1 ${location.pathname === '/pools' ? 'active' : ''}`} onClick={handleSelect}>
              <p className='nav-link mb-0 mt-0 link'>Pools</p>
            </Nav.Link>
          </Nav>
          <Nav className={`ml-auto ${isMobile ? '' : 'mr-12'}`} onSelect={handleSelect}>
            {!isLoggedIn ? (
              <Button component={Link} to="/unlock" variant='contained' size='medium' color='success' className='custom-success-btn font-size-sm mb-0 mt-0'> Connect Wallet</Button>
            ) : (
              <Button onClick={handleLogout} variant='contained' size='medium' color='success' className='custom-success-btn font-size-xs mb-0 mt-0'> Disconnect</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

