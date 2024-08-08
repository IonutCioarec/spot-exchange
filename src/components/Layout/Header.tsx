
import { routeNames } from 'routes/routes';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import { Button } from '@mui/material';
import 'assets/css/header.css';


export const Header = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleSelect = () => setExpanded(false);

  return (
    <>
      <Navbar sticky='top' expanded={expanded} collapseOnSelect expand="lg" className="pl-6 pr-6 pt-0 pb-0" style={{marginBottom: '0', backgroundColor: '#161616'}}>
        <Navbar.Brand as={Link} to={routeNames.home} className='pl-4 pr-4'>
          <p className='text-brand ml-2 mb-0 mt-0'>DEX</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" id='responsive-navbar-toggle' className="custom-toggler" onClick={handleToggle}/>
        <Navbar.Collapse id="responsive-navbar-nav" className='text-up2 pr-5 pl-5 text-center'>
          <Nav className='text-center' onSelect={handleSelect}>
            <Nav.Link as={Link} to="/" className='m-1' onClick={handleSelect}>
              <p className='nav-link mb-0 mt-0'>Home</p>
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className='m-1' onClick={handleSelect}>
              <p className='nav-link mb-0 mt-0'>Swap</p>
            </Nav.Link>
          </Nav>
          <Nav className='ml-auto' onSelect={handleSelect}>
            <Button variant='contained' size='small' color='success' className='mb-0 mt-0'> Connect</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
