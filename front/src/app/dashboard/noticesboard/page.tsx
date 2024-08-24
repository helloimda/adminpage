'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { NoticesBoardTable } from '@/components/dashboard/noticesboard/noticesboard-table';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <NoticesBoardTable />
    </Stack>
  );
}
