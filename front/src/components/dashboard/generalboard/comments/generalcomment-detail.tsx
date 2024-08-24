'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useGeneralCommentDetail } from '@/hooks/board/user-gener';

export default function GeneralCommentDetail(): React.JSX.Element {
  const router = useRouter();
  const { cmtIdx } = useParams(); // next/router useParams hook to get the comment ID from URL params
  const { data, loading, error } = useGeneralCommentDetail(Number(cmtIdx));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="error">
          댓글을 불러오는 중 오류가 발생했습니다.
        </Typography>
      </Box>
    );
  }

  if (!data?.data?.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">해당 댓글을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const comment = data.data[0];

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar />
          <Typography variant="h6">{comment.mem_id}</Typography>
        </Stack>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          작성일: {dayjs(comment.regdt).format('YYYY-MM-DD HH:mm')}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {comment.content}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="primary">
            좋아요: {comment.cnt_good} / 싫어요: {comment.cnt_bad}
          </Typography>
        </Box>
      </CardContent>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => {
          router.push('/dashboard/generalcomments');
        }}
      >
        댓글 목록으로 돌아가기
      </Button>
    </Card>
  );
}
