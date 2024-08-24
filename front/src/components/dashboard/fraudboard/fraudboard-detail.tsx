'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Card, CircularProgress, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useDeleteFraudBoard, useFraudBoardDetail } from '@/hooks/board/use-fraud';

import { ConfirmDialog } from '../customer/confirm-dialog';

export default function FraudDetailPage({ params }: { params: { id: string } }): React.JSX.Element {
  const { id } = params;
  const router = useRouter();

  const { data: fraudDetail, loading, error } = useFraudBoardDetail(Number(id));
  const { doDeleteFraudBoard, loading: deleteLoading } = useDeleteFraudBoard();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (loading) return <CircularProgress />;
  if (error || !fraudDetail) return <Typography>Error loading fraud details.</Typography>;

  const handleEdit = (): void => {
    router.push(`/dashboard/fraudboard/${id}/edit`);
  };

  const handleDelete = async (): Promise<void> => {
    await doDeleteFraudBoard(Number(id));
    router.push('/dashboard/fraudboard');
  };

  const handlePrevImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? (fraudDetail?.images?.length ?? 0) - 1 : prevIndex - 1));
  };

  const handleNextImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === (fraudDetail?.images?.length ?? 0) - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        {fraudDetail.gd_name}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        작성자: {fraudDetail.mem_id} | 조회수: {fraudDetail.cnt_view} | 작성일:{' '}
        {dayjs(fraudDetail.regdt).format('YYYY-MM-DD HH:mm')}
      </Typography>

      {(fraudDetail.images?.length ?? 0) > 0 && (
        <Box sx={{ position: 'relative', mt: 2 }}>
          {fraudDetail.images.length > 1 && (
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
              src={fraudDetail.images[currentImageIndex]?.file_url}
              alt={fraudDetail.images[currentImageIndex]?.file_name}
              sx={{ maxWidth: '100%', maxHeight: '500px', borderRadius: 2 }}
            />
          </Box>
        </Box>
      )}

      <Typography variant="body1" sx={{ mt: 3 }}>
        {fraudDetail.content}
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
        title="사기 게시글 삭제 확인"
        description="이 사기 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
