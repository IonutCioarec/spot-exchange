import { useMediaQuery } from 'react-responsive';

const useMobile = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return isMobile;
};

export default useMobile;