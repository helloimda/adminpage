'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { NoticesBoardTable } from '@/components/dashboard/noticesboard/noticesboard-table';
import { QnaTable } from '@/components/dashboard/qnaboard/qna-table';
import { AnsweredQnaTable } from '@/components/dashboard/qnaboard/qnaanswer-table';
import { NotAnsweredQnaTable } from '@/components/dashboard/qnaboard/qnanoanswer-table';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <NoticesBoardTable />
      <QnaTable />
      <NotAnsweredQnaTable />
      <AnsweredQnaTable />
    </Stack>
  );
}
