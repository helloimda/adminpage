'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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
  const [selectedPeriod, setSelectedPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');
  const chartOptions = useChartOptions();

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setSelectedPeriod(period);
    // 차트 데이터를 업데이트하는 로직을 여기에 추가합니다.
  };

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
        <ButtonGroup variant="contained" color="primary" sx={{ mb: 2, borderRadius: '8px' }}>
          <Button
            onClick={() => {
              handlePeriodChange('daily');
            }}
            disabled={selectedPeriod === 'daily'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'daily' ? 'bold' : 'normal' }}
          >
            일간
          </Button>
          <Button
            onClick={() => {
              handlePeriodChange('weekly');
            }}
            disabled={selectedPeriod === 'weekly'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'weekly' ? 'bold' : 'normal' }}
          >
            주간
          </Button>
          <Button
            onClick={() => {
              handlePeriodChange('monthly');
            }}
            disabled={selectedPeriod === 'monthly'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'monthly' ? 'bold' : 'normal' }}
          >
            월간
          </Button>
        </ButtonGroup>
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
      width: 2,
      colors: [theme.palette.primary.main],
    },
    markers: {
      size: 4,
      colors: [theme.palette.secondary.main],
      strokeColors: theme.palette.background.paper,
      strokeWidth: 2,
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ['11.14', '11.15', '11.16', '11.17', '11.18', '11.19', '11.20'],
      labels: {
        style: {
          colors: theme.palette.text.primary,
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.primary,
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val.toLocaleString()}명`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };
}
