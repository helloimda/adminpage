'use client';

import * as React from 'react';
import { Alert, Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';

import { type User } from '@/types/customer';
import { useDoBen } from '@/hooks/use-customer';

interface CustomerModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function CustomerModal({ open, onClose, user }: CustomerModalProps): React.ReactElement | null {
  const { doBen, loading, error, success } = useDoBen();
  const [stopInfo, setStopInfo] = React.useState('');
  const [stopdf, setStopdf] = React.useState('');

  const handleBanClick = async (): Promise<void> => {
    if (user) {
      await doBen(user.mem_idx, stopInfo, stopdf);
    }
    if (success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  React.useEffect(() => {
    if (success) {
      setStopInfo('');
      setStopdf('');
    }
  }, [success]);

  if (!user) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
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
        <Typography variant="h6" component="h2" gutterBottom>
          회원 정보
        </Typography>
        <Typography variant="body1">
          <strong>아이디:</strong> {user.mem_id}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>닉네임:</strong> {user.mem_nick}
        </Typography>

        <TextField
          fullWidth
          label="정지 사유"
          value={stopInfo}
          onChange={(e) => {
            setStopInfo(e.target.value);
          }}
          sx={{ mt: 3 }}
          multiline
          rows={3}
        />

        <TextField
          fullWidth
          label="정지 해제 기한"
          type="date"
          value={stopdf}
          onChange={(e) => {
            setStopdf(e.target.value);
          }}
          sx={{ mt: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            회원 정지가 완료되었습니다.
          </Alert>
        )}

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
            onClick={handleBanClick}
            disabled={loading || success || false}
            sx={{
              alignSelf: 'flex-end',
            }}
          >
            {loading ? <CircularProgress size={24} /> : '회원 정지'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
