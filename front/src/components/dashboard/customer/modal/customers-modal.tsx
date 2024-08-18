'use client';

import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface CustomerModalProps {
  customer;
  open: boolean;
  onClose: () => void;
}

export function CustomerModal({ open, onClose, customer }: CustomerModalProps): React.ReactElement | null {
  if (!customer) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'transparent' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {customer.name}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Email:</strong> {customer.email}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Location:</strong> {customer.address.city}, {customer.address.state}, {customer.address.country}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Phone:</strong> {customer.phone}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Signed Up:</strong> {dayjs(customer.createdAt).format('MMM D, YYYY')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{
              alignSelf: 'flex-end',
            }}
          >
            회원 정지
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
