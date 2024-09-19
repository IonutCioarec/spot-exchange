import HeartIcon from 'assets/img/heart.svg?react';

export const Footer: React.FC = () => {
  return (
    <footer className=' bottom-0 left-0 w-full text-center small text-white p-1' style={{ borderTop: '1px solid #01b574' }}>
      <div className='d-flex'>
        <div className='mx-auto w-full max-w-prose pb-2 pt-2 pl-6 pr-6'>
          <div className='flex flex-col items-center'>
            <span className='flex items-center hover:underline'>
              Copyright 2024 - Made with <HeartIcon className='fill-red-500 mt-1 mx-1 font-size-lg' width={'18px'} height={'18px'} /> by the DEX team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
