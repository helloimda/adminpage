'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import GeneralBoardDetailPage from '@/components/dashboard/generalboard/generalboard-detail';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <GeneralBoardDetailPage />
    </Stack>
  );
}
