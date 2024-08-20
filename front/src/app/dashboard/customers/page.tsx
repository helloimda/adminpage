import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { CustomersGenderAgeChart } from '@/components/dashboard/customer/chart/customers-gender';
import { CustomersStatisticsChart } from '@/components/dashboard/customer/chart/customers-statisticschart';
import { CustomersBenTable } from '@/components/dashboard/customer/table/customers-bentable';
import { CustomersTable } from '@/components/dashboard/customer/table/customers-table';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <CustomersStatisticsChart />
      <CustomersGenderAgeChart />
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">유저</Typography>
          <CustomersTable />
        </Stack>
      </Stack>
      <Typography variant="h4">정지 유저</Typography>
      <CustomersBenTable />
    </Stack>
  );
}
