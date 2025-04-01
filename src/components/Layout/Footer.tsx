import HeartIcon from 'assets/img/heart.svg?react';
import textLogo from 'assets/img/logo_text.png';
import { useMobile } from 'utils/responsive';

export const Footer: React.FC = () => {
  const isMobile = useMobile();
  
  return (
    <footer className='text-white footer-area font-size-sm'>
      <div className='container d-flex justify-content-between align-items-center'>
        <div>
          <p className='mb-0'>Copyright © 2024
            <img
              src={textLogo}
              alt='textLogo'
              className='cursor-pointer d-inline'
              style={{ height: 19 }}
            />
          </p>
        </div>
        <div className=''>
          <span>Disclaimer: permissionless DEX, DYOR before purchasing!</span>
        </div>
      </div>
    </footer>
  );
};
