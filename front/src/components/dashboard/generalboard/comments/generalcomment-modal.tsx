import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Button, IconButton, Modal, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';

interface CommentContentModalProps {
  open: boolean;
  content: string;
  memId: string;
  regdt: string;
  cntGood: number;
  cntBad: number;
  onClose: () => void;
}

export function CommentContentModal({
  open,
  content,
  memId,
  regdt,
  cntGood,
  cntBad,
  onClose,
}: CommentContentModalProps): React.ReactElement | null {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[5],
          borderRadius: 2,
          p: 4,
          outline: 'none',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            댓글 내용
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Stack>

        <Typography
          sx={{
            mt: 2,
            mb: 4,
            lineHeight: 1.7,
            color: theme.palette.text.primary,
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            fontSize: '1rem',
          }}
        >
          {content}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>작성자:</strong> {memId}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>작성일:</strong> {dayjs(regdt).format('YYYY-MM-DD HH:mm')}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <ThumbUpIcon color="success" />
          <Typography variant="body2" color="text.secondary">
            {cntGood}
          </Typography>
          <ThumbDownIcon color="error" sx={{ ml: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {cntBad}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              fontWeight: 'bold',
            }}
          >
            닫기
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
