import * as React from 'react';
import { useParams } from 'next/navigation';
import { Avatar, Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useGeneralBoardDetail } from '@/hooks/board/user-gener';

export default function GeneralBoardDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const boIdx = id ? parseInt(id, 10) : null;

  const { data, loading, error } = useGeneralBoardDetail(boIdx ?? 0);

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

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {data.images.map((image) => (
              <Grid item xs={12} sm={6} key={image.img_idx}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                  }}
                  alt={image.file_name}
                  src={image.file_url}
                />
              </Grid>
            ))}
          </Grid>

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
        </CardContent>
      </Card>
    </Box>
  );
}
