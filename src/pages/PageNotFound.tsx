import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

export const PageNotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className='swap-page-height py-5 mb-5'>
      <div className='pt-12 mt-5 flex flex-col p-6 items-center justify-center gap-2 rounded-xl bg-[#202020] w-full'>
        <FontAwesomeIcon icon={faSearch} className='fa-3x mb-2 text-white' />

        <div className='flex flex-col items-center'>
          <h4 className='mt-3 text-xl text-white'>Page not found</h4>
          <span className='text-lg text-white'>{pathname}</span>
        </div>
      </div>
    </div>
  );
};
