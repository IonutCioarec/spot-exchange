import { useMediaQuery } from 'react-responsive';

// Hook to detect mobile devices
export const useMobile = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  return isMobile;
};

// Hook to detect tablet devices
export const useTablet = () => {
  const isTablet = useMediaQuery({ query: '(min-width: 641px) and (max-width: 1024px)' });
  return isTablet;
};

export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent
);