import React from 'react';
import { Modal, Box } from '@mui/material';

const ExpenseImagemodal = ({ open, onClose, image }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          outline: 'none',
        }}
      >
        <img
          src={image}
          alt="Full View"
          style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
        />
      </Box>
    </Modal>
  );
};

export default ExpenseImagemodal;
