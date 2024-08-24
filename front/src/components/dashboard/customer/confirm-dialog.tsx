'use client';

import * as React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  confirmButtonText: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmButtonText,
}: ConfirmDialogProps): React.ReactElement {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mt: 1,
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {description}
        </DialogContentText>
        <Alert severity="warning" sx={{ mt: 2 }}>
          이 작업은 되돌릴 수 없습니다. 신중하게 결정해 주세요.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            fontWeight: 'bold',
            color: 'grey.600',
          }}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          sx={{
            fontWeight: 'bold',
            backgroundColor: 'error.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
