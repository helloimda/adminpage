'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Avatar, Box, Button, Card, CardContent, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { usePostQnaAnswer, useQnaDetail } from '@/hooks/board/use-qna'; // QNA 관련 훅 사용

export default function QnaDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const meqIdx = id ? parseInt(id, 10) : null;
  const router = useRouter();
  const { data, loading, error } = useQnaDetail(meqIdx ?? 0);
  const { doPostAnswer, loading: answerLoading, error: answerError } = usePostQnaAnswer();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState({ rsubject: '', rcontent: '' }); // 답변 내용 상태 관리

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

  const handleAnswerSubmit = async (): Promise<void> => {
    if (meqIdx !== null && answer.rsubject && answer.rcontent) {
      await doPostAnswer(meqIdx, answer.rsubject, answer.rcontent);
      if (!answerError) {
        router.push(`/dashboard/noticesboard`);
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
                답변 상태: {data.isresponse === 'Y' ? '답변 완료' : '미답변'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" color="textSecondary">
                작성일: {dayjs(data.regdt).format('YYYY-MM-DD HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary">
                답변 제목: {data.rsubject || 'N/A'}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                답변 내용: {data.rcontent || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          {data.isresponse === 'N' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                답변 작성
              </Typography>
              <TextField
                label="답변 제목"
                fullWidth
                value={answer.rsubject}
                onChange={(e) => {
                  setAnswer({ ...answer, rsubject: e.target.value });
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="답변 내용"
                fullWidth
                multiline
                rows={4}
                value={answer.rcontent}
                onChange={(e) => {
                  setAnswer({ ...answer, rcontent: e.target.value });
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAnswerSubmit}
                  disabled={answerLoading || !answer.rsubject || !answer.rcontent}
                >
                  {answerLoading ? '답변 등록 중...' : '답변 등록'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {answerError !== null && answerError !== undefined && (
        <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
          {answerError}
        </Typography>
      )}
    </Box>
  );
}
