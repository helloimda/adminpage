'use client';

import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { type BenUser, type User } from '@/types/customer';
import { useDoUnBen } from '@/hooks/use-customer';

interface CustomerModalProps {
  benUser: BenUser | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export function BenCustomerModal({ open, onClose, benUser, onUpdate }: CustomerModalProps): React.ReactElement | null {
  const { doUnBen, loading, error, success } = useDoUnBen();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!benUser) {
    return null;
  }

  const handleUnBen = async (): Promise<void> => {
    await doUnBen(benUser.mem_idx);
    const updatedUser: User = { ...benUser, stopdt: null, stop_info: null };
    onUpdate(updatedUser);
    setConfirmOpen(false);
    onClose();
  };

  const formattedDate = benUser.stopdt ? dayjs(benUser.stopdt).format('YYYY년 M월 D일') : '무기한';

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              회원 상세 정보
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              정지 해제가 완료되었습니다.
            </Alert>
          )}

          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Avatar
                src={benUser.mem_profile_url || undefined}
                alt={benUser.mem_nick}
                sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6">{benUser.mem_nick}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {benUser.mem_id}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body1">
                <strong>이메일:</strong> {benUser.mem_email || '없음'}
              </Typography>
              <Typography variant="body1">
                <strong>전화번호:</strong> {benUser.mem_hp || '없음'}
              </Typography>
              <Stack direction="row" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  <strong>정지 상태:</strong>
                </Typography>
                <WarningAmberIcon color="error" />
                <Typography variant="body1" sx={{ ml: 0.5, color: 'error.main' }}>
                  정지됨
                </Typography>
              </Stack>
              <Typography variant="body1">
                <strong>정지 사유:</strong> {benUser.stop_info || '사유 없음'}
              </Typography>
              <Typography variant="body1">
                <strong>정지 해제일:</strong> {formattedDate}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              닫기
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setConfirmOpen(true);
              }}
              disabled={loading}
              startIcon={<CheckCircleIcon />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '정지 해제'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* 정지 해제 확인 다이얼로그 */}
      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
          정말로 정지를 해제하시겠습니까?
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
            {benUser.mem_nick}님의 정지를 해제하면 즉시 서비스 이용이 가능해집니다.
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            이 작업은 회원의 서비스 접근을 즉시 허용하게 됩니다
          </Alert>
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button
            onClick={() => {
              setConfirmOpen(false);
            }}
            color="primary"
            sx={{
              fontWeight: 'bold',
              color: 'grey.600',
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleUnBen}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : '해제'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
