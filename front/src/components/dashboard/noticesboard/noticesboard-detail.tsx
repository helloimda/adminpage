'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Card, CircularProgress, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useDeleteNotice, useNoticeDetail } from '@/hooks/board/use-notices';

import { ConfirmDialog } from '../customer/confirm-dialog';

export default function NoticeDetailPage({ params }: { params: { id: string } }): React.JSX.Element {
  const { id } = params;
  const router = useRouter();

  const { data: notice, loading, error } = useNoticeDetail(Number(id));
  const { doDeleteNotice, loading: deleteLoading } = useDeleteNotice();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading notice details.</Typography>;

  const handleEdit = (): void => {
    router.push(`/dashboard/noticesboard/${id}/edit`);
  };

  const handleDelete = async (): Promise<void> => {
    await doDeleteNotice(Number(id));
    router.push('/dashboard/noticesboard');
  };

  const handlePrevImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (notice?.images?.length ?? 0) - 1 : prevIndex - 1));
  };

  const handleNextImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === (notice?.images?.length ?? 0) - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        {notice?.subject}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        작성자: {notice?.mem_id} | 조회수: {notice?.cnt_view} | 작성일:{' '}
        {dayjs(notice?.regdt).format('YYYY-MM-DD HH:mm')}
      </Typography>

      {(notice?.images?.length ?? 0) > 0 && (
        <Box sx={{ position: 'relative', mt: 2 }}>
          {(notice?.images?.length ?? 0) > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 'auto',
              overflow: 'hidden',
              mt: 2,
            }}
          >
            <Box
              component="img"
              src={notice?.images?.[currentImageIndex]?.file_url}
              alt={notice?.images?.[currentImageIndex]?.file_name}
              sx={{ maxWidth: '100%', maxHeight: '500px', borderRadius: 2 }}
            />
          </Box>
        </Box>
      )}

      <Typography variant="body1" sx={{ mt: 3 }}>
        {notice?.content}
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          수정
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setConfirmOpen(true);
          }}
          disabled={deleteLoading}
        >
          {deleteLoading ? '삭제 중...' : '삭제'}
        </Button>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="공지사항 삭제 확인"
        description="이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
