import 'assets/css/loader.css';
import { MoonLoader, PulseLoader } from 'react-spinners';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';

const FilterLoader = () => {
  return (
    <div className='mt-2' style={{ minHeight: '20vh' }}>
      <div className='flex flex-col p-3 items-center justify-center gap-2 rounded-xl bg-[#083121] w-full'>
        <div className='flex flex-col items-center mt-1'>
          <CircularProgress
            sx={{
              color: '#01b574',
              animationDuration: '2s',
            }}
            thickness={3}
            size={35}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterLoader;