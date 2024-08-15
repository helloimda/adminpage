'use client';
'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

// Chart 컴포넌트를 동적으로 로드
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MemberGrowthChartProps {
  totalMembers: number;
  increase: number;
  increasePercentage: number;
  chartSeries: { name: string; data: number[] }[];
}

export function MemberGrowthChart({
  totalMembers,
  increase,
  increasePercentage,
  chartSeries,
}: MemberGrowthChartProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="textSecondary">
          전체 회원수
        </Typography>
        <Typography variant="h4" component="div">
          {totalMembers.toLocaleString()}명
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          지난주에 비해 <strong>{increase.toLocaleString()}명</strong> 증가했어요.
          <Typography component="span" color="error" sx={{ ml: 1, fontWeight: 'bold' }}>
            {increasePercentage}% <ArrowUpwardIcon fontSize="small" />
          </Typography>
        </Typography>
        <Chart options={chartOptions} series={chartSeries} type="line" height={250} width="100%" />
      </CardContent>
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
      colors: [theme.palette.primary.main],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: ['11.14', '11.15', '11.16', '11.17', '11.18', '11.19', '11.20'],
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}명`,
      },
    },
  };
}
