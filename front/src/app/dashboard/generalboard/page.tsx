import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import { GeneralBoardCategoryDountChart } from '@/components/dashboard/generalboard/chart/generalboard-dounchart';
import { GeneralBoardTable } from '@/components/dashboard/generalboard/generalboard-table';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <GeneralBoardCategoryDountChart date={'2024-07-16'} />
      <GeneralBoardTable />
    </Stack>
  );
}
