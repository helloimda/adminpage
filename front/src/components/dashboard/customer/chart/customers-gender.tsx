'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface CustomerGenderChartProps {
  male: number;
  female: number;
  sx?: SxProps;
}

export function CustomerGenderChart({ male, female, sx }: CustomerGenderChartProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  const chartSeries = [male, female]; // 데이터 시리즈 설정

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title="사용자 성별"
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="pie" width="100%" />
      </CardContent>
      <Divider />
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', toolbar: { show: false } },
    colors: ['#1E90FF', '#FF69B4'], // 남성, 여성 색상
    dataLabels: { enabled: true },
    labels: ['Male', 'Female'],
    legend: { position: 'bottom' },
    theme: { mode: theme.palette.mode },
  };
}
