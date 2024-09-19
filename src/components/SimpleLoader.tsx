import 'assets/css/loader.css';
import { MoonLoader, PulseLoader } from 'react-spinners';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';

const SimpleLoader = () => {
  return (
    <div className='flex flex-col items-center m-3'>
      <CircularProgress
        sx={{
          color: '#01b574',
          animationDuration: '2s',
        }}
        thickness={3}
        size={35}
      />
    </div>
  );
};

export default SimpleLoader;