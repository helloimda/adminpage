'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { NoticeCreateForm } from '@/components/dashboard/noticesboard/noticesboard-create';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <NoticeCreateForm />
    </Stack>
  );
}
