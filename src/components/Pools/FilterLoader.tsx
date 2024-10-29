import 'assets/css/loader.css';
import 'assets/scss/pools.scss';
import { MoonLoader, PulseLoader } from 'react-spinners';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';

const FilterLoader = () => {
  return (
    <div className='flex flex-col p-3 items-center justify-center gap-2 rounded-lg pool w-full'>
      <div className='flex flex-col items-center mt-1'>
        <CircularProgress
          sx={{
            color: '#3FAC5A',
            animationDuration: '2s',
          }}
          thickness={3}
          size={35}
        />
      </div>
    </div>
  );
};

export default FilterLoader;