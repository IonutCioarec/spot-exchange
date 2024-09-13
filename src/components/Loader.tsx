import 'assets/css/loader.css';
import { MoonLoader, PulseLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className='container mt-5' style={{ minHeight: '30vh' }}>
      <div className='flex flex-col p-6 items-center justify-center gap-2 rounded-xl bg-[#202020] w-full'>
        <div className='flex flex-col items-center'>
          {/* White Spinner */}
          <MoonLoader
            color="#ffffff"
            size={30}
            speedMultiplier={0.5}
            className='loader'
          />

          {/* Loading Text with Blinking Dots */}
          <h4 className='mt-3 text-xl text-white flex'>
            Loading
            <span className='mt-1 ms-1'>
              <PulseLoader
                color="#ffffff"
                margin={3}
                size={3}
                speedMultiplier={0.6}
              />
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Loader;