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

import type { MemberDateType } from '@/types/customer';
import { useMembersCountByType } from '@/hooks/use-customer';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function MemberGrowthChart(): React.JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = React.useState<MemberDateType>('date');
  const { memberCount, loading, error } = useMembersCountByType(selectedPeriod);

  // 증가량과 퍼센트 계산
  const { increase, increasePercentage } = React.useMemo(() => {
    if (memberCount.length < 2) return { increase: 0, increasePercentage: 0 };

    const latestCount = Object.values(memberCount[0])[0];
    const previousCount = Object.values(memberCount[1])[0];
    const increase = latestCount - previousCount;
    const increasePercentage = previousCount ? (increase / previousCount) * 100 : 0;

    return { increase, increasePercentage };
  }, [memberCount]);

  const chartOptions = useChartOptions(memberCount);

  const updatedChartSeries = React.useMemo(() => {
    return [
      {
        name: '회원가입 수',
        data: memberCount.map((item) => {
          const [_date, count] = Object.entries(item)[0];
          return count;
        }),
      },
    ];
  }, [memberCount]);

  const handlePeriodChange = (period: MemberDateType): void => {
    setSelectedPeriod(period);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="textSecondary">
          전체 회원수
        </Typography>
        <Typography variant="h4" component="div">
          {Object.values(memberCount[0] || { 0: 0 })[0].toLocaleString()}명
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {selectedPeriod === 'date' ? '지난일에' : selectedPeriod === 'week' ? '지난주에' : '지난달에'}{' '}
          <strong>{increase.toLocaleString()}명</strong> 증가했어요.
          <Typography component="span" color="error" sx={{ ml: 1, fontWeight: 'bold' }}>
            {increasePercentage.toFixed(2)}% <ArrowUpwardIcon fontSize="small" />
          </Typography>
        </Typography>
        <ButtonGroup variant="contained" color="primary" sx={{ mb: 2, borderRadius: '8px' }}>
          <Button
            onClick={() => {
              handlePeriodChange('date');
            }}
            disabled={selectedPeriod === 'date'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'date' ? 'bold' : 'normal' }}
          >
            일간
          </Button>
          <Button
            onClick={() => {
              handlePeriodChange('week');
            }}
            disabled={selectedPeriod === 'week'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'week' ? 'bold' : 'normal' }}
          >
            주간
          </Button>
          <Button
            onClick={() => {
              handlePeriodChange('month');
            }}
            disabled={selectedPeriod === 'month'}
            sx={{ textTransform: 'none', fontWeight: selectedPeriod === 'month' ? 'bold' : 'normal' }}
          >
            월간
          </Button>
        </ButtonGroup>
        {loading ? (
          <Typography variant="body2" color="textSecondary">
            데이터를 불러오는 중입니다...
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          <Chart options={chartOptions} series={updatedChartSeries} type="line" height={250} width="100%" />
        )}
      </CardContent>
    </Card>
  );
}

function useChartOptions(memberCount: Record<string, number>[]): ApexOptions {
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
      categories: memberCount.map((item) => Object.keys(item)[0]), // 날짜를 x축에 반영
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
