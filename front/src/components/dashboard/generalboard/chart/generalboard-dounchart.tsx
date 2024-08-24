'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import { useGeneralPostCategoriesByPeriod } from '@/hooks/board/user-gener';
import { Chart } from '@/components/core/chart';

export interface PostCategoryChartProps {
  sx?: SxProps;
}

export function GeneralBoardCategoryChart({ sx }: PostCategoryChartProps): React.JSX.Element {
  const { data, loading, error } = useGeneralPostCategoriesByPeriod();
  const [chartSeries, setChartSeries] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      const sortedCategories = data.sort((a, b) => b.total_posts - a.total_posts);
      const topCategories = sortedCategories.slice(0, 4);
      const otherCategories = sortedCategories.slice(4);

      const otherCount = otherCategories.reduce((acc, curr) => acc + curr.total_posts, 0);

      setChartSeries([...topCategories.map((category) => category.total_posts), otherCount]);
      setLabels([...topCategories.map((category) => category.cd_tag || `Category ${category.ca_idx}`), '기타']);
    }
  }, [data]);

  const chartOptions = useChartOptions(labels);

  if (loading) return <div>Loading...</div>;
  if (error || chartSeries.length === 0) return <div>Error: 데이터를 로드하는 데 문제가 발생했습니다.</div>;

  return (
    <Card sx={sx}>
      <CardHeader title="게시판 " />
      <CardContent>
        <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      type: 'donut',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main, // 추가 색상
      '#FF5733',
      '#33FF57',
      '#3357FF',
    ],
    labels,
    legend: { show: true, position: 'bottom' },
    plotOptions: { pie: { expandOnClick: false, donut: { size: '75%' } } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
