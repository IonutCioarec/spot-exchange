import React, { forwardRef, Fragment, useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, DialogTitle, Divider, IconButton, Button } from '@mui/material';
import { formatSignificantDecimals, intlNumberFormat } from 'utils/formatters';
import { KeyboardArrowDown, Search, ArrowDropDown } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import SimpleLoader from 'components/SimpleLoader';
import { useMobile } from 'utils/responsive';
import { useTablet } from 'utils/responsive';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DisplayModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  content: React.JSX.Element;
}

const DisplayModal: React.FC<DisplayModalProps> = ({
  isOpen,
  setIsOpen,
  title, 
  content
}) => {
  const isMobile = useMobile();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        style={{ borderRadius: '10px' }}
        TransitionComponent={Transition}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          style: { backgroundColor: 'rgba(20, 20, 20, 0.9)', borderRadius: '10px', minHeight: '100px', zIndex: 1300 },
        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <div className='d-flex justify-content-between font-rose align-items-center'>
            <p className='text-white mx-auto mb-0'>{title}</p>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              className='text-right text-white close-button'
              sx={{ borderRadius: '20px !important' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisplayModal;