'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import QnaDetailPage from '@/components/dashboard/qnaboard/qna-detail';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <QnaDetailPage />
    </Stack>
  );
}
