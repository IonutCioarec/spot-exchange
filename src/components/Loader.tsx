
const Loader = () => {
  return (
    <div className='container mt-5' style={{minHeight: '30vh'}}>
      <div className='flex flex-col p-6 items-center justify-center gap-2 rounded-xl bg-[#202020] w-full'> 
        <div className='flex flex-col items-center'>
          <h4 className='mt-3 text-xl text-white'>Loading...</h4>
        </div>
      </div>
    </div>
  );
};

export default Loader;