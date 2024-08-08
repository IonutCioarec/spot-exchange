import HeartIcon from 'assets/img/heart.svg?react';

export const Footer: React.FC = () => {
  return (
    <footer className='fixed bottom-0 left-0 w-full text-center small text-white' style={{backgroundColor: '#161616'}}>
      <div className='mx-auto w-full max-w-prose pb-2 pt-2 pl-6 pr-6'>
        <div className='flex flex-col items-center'>
          <span className='flex items-center hover:underline'>
            Made with <HeartIcon className='fill-red-500 mt-1 mx-1 font-size-lg' width={'18px'} height={'18px'} /> by the DEX team
          </span>
        </div>
      </div>
    </footer>
  );
};
