import { Button as MuiButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Button as BootstrapButton } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to SyndicateX</h1>
      <div className="mb-4">
        <MuiButton variant="contained" color="primary">MUI Button</MuiButton>
      </div>
      <div className="mb-4">
        <BootstrapButton variant="primary">React-Bootstrap Button</BootstrapButton>
      </div>
      <div className="mb-4">
        <FontAwesomeIcon icon={faCoffee} size="2x" />
      </div>
    </div>
  );
}

export default Home;