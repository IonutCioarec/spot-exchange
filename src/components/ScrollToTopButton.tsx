import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Button, IconButton } from '@mui/material';

interface ScrollToRefButtonProps {
  targetRefId: string;
  bottom?: string;
  right?: string;
}

const ScrollToRefButton: React.FC<ScrollToRefButtonProps> = ({ targetRefId, bottom ='11vh', right = '13px' }) => {
  const scrollToRef = () => {
    const targetElement = document.getElementById(targetRefId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={scrollToRef}
      size="small"
      className="btn-intense-default hover-btn small b-r-sm btn-scroll-top"
      style={{
        position: 'fixed',
        bottom: bottom,
        right: right,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
        minWidth: '40px',
        minHeight: '40px',
        zIndex: 1000,
      }}
    >
      <ArrowUpwardIcon />
    </Button>    
  );
};

export default ScrollToRefButton;