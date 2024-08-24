import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import type { CreateNoticeRequest } from '@/types/board/notices';
import { useCreateNotice } from '@/hooks/board/use-notices';

export function NoticeCreateForm(): React.JSX.Element {
  const { doCreateNotice, loading, error } = useCreateNotice();

  const [subject, setSubject] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const newNotice: CreateNoticeRequest = {
      mem_idx: 1, // 작성자 ID, 실제로는 로그인된 유저의 ID를 사용해야 합니다.
      mem_id: 'testuser', // 작성자 아이디, 실제로는 로그인된 유저의 아이디를 사용해야 합니다.
      subject,
      content,
      tags: null,
      istemp: 'N',
      isdel: 'N',
      cnt_view: 0,
    };

    const response = await doCreateNotice(newNotice);
    if (response) {
      // 성공적으로 생성된 경우 추가 작업 수행
      // 예를 들어, 폼 초기화 또는 페이지 이동
      setSubject('');
      setContent('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        공지사항 생성
      </Typography>
      <TextField
        fullWidth
        label="제목"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
        }}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="내용"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        required
        multiline
        rows={6}
        margin="normal"
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading}>
        {loading ? '생성 중...' : '생성'}
      </Button>
    </Box>
  );
}
