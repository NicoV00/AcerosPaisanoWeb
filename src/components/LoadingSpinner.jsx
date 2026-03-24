import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000'
      }}
    >
      <CircularProgress sx={{ color: '#ff0000' }} />
    </Box>
  );
};