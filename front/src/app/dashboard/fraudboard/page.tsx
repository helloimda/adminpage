'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';

import { FraudBoardTable } from '@/components/dashboard/fraudboard/fraudboard-table';
import { BoardReportTable } from '@/components/dashboard/report/boardreport-table';
import { MemberReportTable } from '@/components/dashboard/report/memberreport-table';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <FraudBoardTable />
      <BoardReportTable />
      <MemberReportTable />
    </Stack>
  );
}
