import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { GeneralBoardCategoryChart } from '@/components/dashboard/generalboard/chart/generalboard-dounchart';
import { GeneralBoardTable } from '@/components/dashboard/generalboard/generalboard-table';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '400px' }} // 차트의 높이를 명시적으로 설정
        />
      </Grid>
      <Grid lg={4} md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
        <GeneralBoardCategoryChart sx={{ height: '400px' }} /> {/* 차트 높이 조정 */}
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <GeneralBoardTable sx={{ height: '400px' }} /> {/* 테이블 높이 조정 */}
      </Grid>
    </Grid>
  );
}
