'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useDeleteNotice, useNoticeDetail } from '@/hooks/board/use-notices';

export default function NoticeDetailPage({ params }: { params: { id: string } }): React.JSX.Element {
  const { id } = params;
  const router = useRouter();

  const { data: notice, loading, error } = useNoticeDetail(Number(id));
  const { doDeleteNotice, loading: deleteLoading } = useDeleteNotice();

  const handleEdit = (): void => {
    router.push(`/dashboard/noticesboard/${id}/edit`);
  };

  const handleDelete = async (): Promise<void> => {
    await doDeleteNotice(Number(id));
    router.push('/dashboard/noticesboard');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading notice details.</Typography>;

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">{notice?.subject}</Typography>
      <Typography variant="subtitle2">{`작성자: ${notice?.mem_id} | 조회수: ${notice?.cnt_view} | 작성일: ${dayjs(notice?.regdt).format('YYYY-MM-DD HH:mm')}`}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {notice?.content}
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
          {deleteLoading ? '삭제 중...' : '삭제'}
        </Button>
      </Box>
    </Card>
  );
}
