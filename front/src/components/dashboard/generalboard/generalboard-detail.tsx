'use client';

import * as React from 'react';
import { Avatar, Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface Image {
  img_idx: number;
  file_name: string;
  file_url: string;
}

interface GeneralBoardDetail {
  bo_idx: number;
  mem_idx: number;
  mem_id: string;
  ca_idx: number;
  cd_subtag: string | null;
  brand_idx: number | null;
  cal_idx: number | null;
  subject: string;
  content: string;
  link: string | null;
  tags: string;
  newsdt: string | null;
  cnt_view: number;
  cnt_star: number;
  avg_star: number;
  cnt_good: number;
  cnt_bad: number;
  cnt_comment: number;
  cnt_bookmark: number;
  cnt_img: number;
  istemp: string;
  popdt: string | null;
  regdt: string;
  images: Image[];
}

export default function GeneralBoardDetailPage(): React.JSX.Element {
  const data: GeneralBoardDetail = {
    bo_idx: 435,
    mem_idx: 34,
    mem_id: 'test13',
    ca_idx: 9,
    cd_subtag: null,
    brand_idx: null,
    cal_idx: null,
    subject: '확인게시글',
    content: '잘부탁드립니다!',
    link: null,
    tags: '',
    newsdt: null,
    cnt_view: 3,
    cnt_star: 0,
    avg_star: 0,
    cnt_good: 0,
    cnt_bad: 0,
    cnt_comment: 0,
    cnt_bookmark: 0,
    cnt_img: 9,
    istemp: 'N',
    popdt: null,
    regdt: '2024-08-01T00:44:29.000Z',
    images: [
      {
        img_idx: 417,
        file_name: '1000031438.jpg',
        file_url: 'https://hdumdu.s3.ap-northeast-2.amazonaws.com/hdumdu/202408/1722473036217-1000031438.jpg',
      },
      {
        img_idx: 418,
        file_name: '1000031437.jpg',
        file_url: 'https://hdumdu.s3.ap-northeast-2.amazonaws.com/hdumdu/202408/1722473036851-1000031437.jpg',
      },
      // 나머지 이미지 추가
    ],
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
