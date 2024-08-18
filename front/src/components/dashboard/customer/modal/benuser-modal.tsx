'use client';

import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { type BenUser } from '@/types/customer';

interface CustomerModalProps {
  benUser: BenUser | null;
  open: boolean;
  onClose: () => void;
}

export function BenCustomerModal({ open, onClose, benUser }: CustomerModalProps): React.ReactElement | null {
  if (!benUser) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {benUser.mem_nick}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography sx={{ mt: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
          <strong>Phone:</strong> {benUser.mem_hp}
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
          <strong>정지 사유:</strong> {benUser.stop_info}
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
          <strong>정지 해제일:</strong> {dayjs(benUser.stopdt).format('YYYY년 M월 D일')}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variant="outlined" color="primary" onClick={onClose} sx={{ mr: 2 }}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              alignSelf: 'flex-end',
            }}
          >
            정지 해제
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
