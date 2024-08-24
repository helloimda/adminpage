import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
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
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { type User } from '@/types/customer';
import { useDoBen } from '@/hooks/use-customer';

interface CustomerModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export function CustomerModal({ open, onClose, user, onUpdate }: CustomerModalProps): React.ReactElement | null {
  const { doBen, loading, error, success } = useDoBen();
  const [stopInfo, setStopInfo] = React.useState('');
  const [stopdt, setStopdt] = React.useState('');
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleBanClick = async (): Promise<void> => {
    if (user) {
      await doBen(user.mem_idx, stopInfo, stopdt);
      const updatedUser = { ...user, stopdt, stop_info: stopInfo };
      onUpdate(updatedUser);
      setConfirmOpen(false);
    }
  };

  React.useEffect(() => {
    if (success) {
      setStopInfo('');
      setStopdt('');
    }
  }, [success]);

  if (!user) {
    return null;
  }

  const isBanned = Boolean(user.stop_info);

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <Modal open={open} onClose={onClose} BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}>
      <Box
        sx={{
          position: 'absolute',
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
        <IconButton onClick={onClose} sx={{ color: 'grey.500', position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom>
          회원 정보
        </Typography>

        <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={user.mem_profile_url || undefined} alt={user.mem_nick} sx={{ width: 64, height: 64 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6">{user.mem_nick}</Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {user.mem_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전화번호: {user.mem_hp || '없음'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              <strong>정지 상태:</strong>
            </Typography>
            {isBanned ? (
              <WarningIcon color="error" sx={{ mr: 1 }} />
            ) : (
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            )}
            <Typography variant="body1">{isBanned ? '정지됨' : '정지되지 않음'}</Typography>
          </Stack>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          정지 설정
        </Typography>

        <TextField
          fullWidth
          label="정지 사유"
          value={stopInfo}
          onChange={(e) => {
            setStopInfo(e.target.value);
          }}
          sx={{ mt: 1 }}
          multiline
          rows={3}
        />

        <TextField
          fullWidth
          label="정지 해제 기한"
          type="date"
          value={stopdt}
          onChange={(e) => {
            setStopdt(e.target.value);
          }}
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }} // 오늘 날짜 이후로만 선택 가능
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
          <Button variant="outlined" color="primary" onClick={onClose} sx={{ mr: 2 }} disabled={loading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmOpen(true);
            }} // 다이얼로그 열기
            disabled={loading || success || !stopInfo || !stopdt}
            sx={{ alignSelf: 'flex-end' }}
          >
            {loading ? <CircularProgress size={24} /> : '회원 정지'}
          </Button>
        </Box>

        {/* 확인 다이얼로그 */}
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
            정말로 정지를 설정하시겠습니까?
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
              이 작업은 되돌릴 수 없습니다.
              <br />
              <strong>{user.mem_nick}</strong>님의 정지를 설정하면 즉시 서비스 이용이 제한됩니다.
            </DialogContentText>
            <Alert severity="warning" sx={{ mt: 2 }}>
              이 작업은 회원의 서비스 접근을 즉시 제한하게 됩니다.
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
              onClick={handleBanClick}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : '정지'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}
