'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import { usePostCategoriesByDate } from '@/hooks/board/user-gener';
import { Chart } from '@/components/core/chart';

export interface PostCategoryChartProps {
  date: string;
  sx?: SxProps;
}

export function GeneralBoardCategoryDountChart({ date, sx }: PostCategoryChartProps): React.JSX.Element {
  const { data, loading, error } = usePostCategoriesByDate(date);
  const [chartSeries, setChartSeries] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      setChartSeries(data.map((category) => category.count));
      setLabels(data.map((category) => category.cd_subtag || `Category ${category.ca_idx}`));
    }
  }, [data]);

  const chartOptions = useChartOptions(labels);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card sx={sx}>
      <CardHeader title="게시판별 게시글 횟수" />
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => (
              <Stack key={labels[index]} spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{labels[index]}</Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item}개
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
