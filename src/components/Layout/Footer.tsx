import HeartIcon from 'assets/img/heart.svg?react';

export const Footer: React.FC = () => {
  return (
    <footer className='text-white footer-area font-size-sm'>
      <div className='container d-flex justify-content-between align-items-center'>
        <div>
          <p className='mb-0'>Copyright © 2024 <span className='text-intense-green'>Emeral<span className='half-colored-d'>D</span></span>EX</p>
        </div>
        <div className=''>
          <span>Disclaimer: permissionless DEX, DYOR before purchasing!</span>          
        </div>
      </div>
    </footer>
  );
};
