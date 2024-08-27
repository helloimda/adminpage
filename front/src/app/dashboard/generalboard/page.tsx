import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { GeneralBoardCategoryChart } from '@/components/dashboard/generalboard/chart/generalboard-dounchart';
import { GeneralCommentTable } from '@/components/dashboard/generalboard/comments/generalcomment-table';
import { GeneralBoardTable } from '@/components/dashboard/generalboard/generalboard-table';
import { LimitedSalesTable } from '@/components/dashboard/limitedboard/limited-table';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <GeneralBoardCategoryChart />
      <GeneralBoardTable />
      <GeneralCommentTable />
      <LimitedSalesTable />
    </Stack>
  );
}
