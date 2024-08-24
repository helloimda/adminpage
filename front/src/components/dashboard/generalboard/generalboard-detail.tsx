'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Avatar, Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useDeleteGeneralBoard, useGeneralBoardDetail } from '@/hooks/board/user-gener';

import { ConfirmDialog } from '../customer/confirm-dialog';

export default function GeneralBoardDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const boIdx = id ? parseInt(id, 10) : null;
  const router = useRouter();
  const { data, loading, error } = useGeneralBoardDetail(boIdx ?? 0);
  const { doDeleteBoard, loading: deleteLoading, error: deleteError } = useDeleteGeneralBoard();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5" color="textSecondary" align="center">
          데이터를 불러오지 못했습니다.
        </Typography>
      </Box>
    );
  }

  const handlePrevImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? data.images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = (): void => {
    setCurrentImageIndex((prevIndex) => (prevIndex === data.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDelete = async (): Promise<void> => {
    if (boIdx !== null) {
      await doDeleteBoard(boIdx);
      if (!deleteError) {
        router.push('/dashboard/generalboard'); // 삭제 후 목록 페이지로 이동
      }
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Card sx={{ maxWidth: 1000, margin: 'auto' }}>
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {data.subject}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ width: 64, height: 64 }}>{data.mem_id.charAt(0).toUpperCase()}</Avatar>
            <Typography variant="h6">{data.mem_id}</Typography>
            <Typography variant="body1" color="textSecondary">
              {dayjs(data.regdt).format('YYYY-MM-DD HH:mm')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              조회수: {data.cnt_view}
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ mt: 4 }}>
            {data.content}
          </Typography>

          <Box sx={{ position: 'relative', mt: 4 }}>
            {data.images.length > 1 && (
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
              }}
            >
              <Box
                component="img"
                src={data.images[currentImageIndex]?.file_url}
                alt={data.images[currentImageIndex]?.file_name}
                sx={{ maxWidth: '100%', maxHeight: '500px', borderRadius: 2 }}
              />
            </Box>
          </Box>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={6}>
              <Typography variant="h6" color="textSecondary">
                좋아요: {data.cnt_good}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="textSecondary">
                싫어요: {data.cnt_bad}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="textSecondary">
                댓글 수: {data.cnt_comment}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="textSecondary">
                북마크 수: {data.cnt_bookmark}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {deleteError && (
              <Typography variant="body2" color="error">
                {deleteError}
              </Typography>
            )}
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
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="게시글 삭제 확인"
        description="이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Box>
  );
}
