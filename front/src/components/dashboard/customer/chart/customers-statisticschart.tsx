'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import type { MemberDateType } from '@/types/customer';
import { useMembersCountByType, useMembersRegisterByType, useMembersVisitedByType } from '@/hooks/use-customer';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function CustomersStatisticsChart(): React.JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = React.useState<MemberDateType>('date');

  const { memberCount, loading: memberCountLoading, error: memberCountError } = useMembersCountByType(selectedPeriod);
  const {
    memberCount: visitedCount,
    loading: visitedCountLoading,
    error: visitedCountError,
  } = useMembersVisitedByType(selectedPeriod);
  const {
    memberCount: registerCount,
    loading: registerLoading,
    error: registerError,
  } = useMembersRegisterByType(selectedPeriod);

  const theme = useTheme();

  const latestCount = memberCount.length > 0 ? Object.values(memberCount[memberCount.length - 1])[0] || 0 : 0;
  const previousCount = memberCount.length > 1 ? Object.values(memberCount[memberCount.length - 2])[0] || 0 : 0;
  const increase = latestCount - previousCount;

  const increasePercentage = React.useMemo(() => {
    if (previousCount === 0) {
      return latestCount > 0 ? 100 : 0;
    }
    return (increase / previousCount) * 100;
  }, [latestCount, previousCount, increase]);

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 4,
      colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main],
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
      categories:
        memberCount && memberCount.length > 0
          ? memberCount.map((item) => {
              const key = Object.keys(item)[0];
              return key ? key.toString() : 'Unknown';
            })
          : ['No Data'],
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
        formatter: (val: number) => `${val?.toLocaleString()}명`,
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

  const chartSeries = React.useMemo(
    () => [
      {
        name: '회원수',
        data: memberCount && memberCount.length > 0 ? memberCount.map((item) => Object.values(item)[0] || 0) : [0],
      },
      {
        name: '오늘 가입한 회원수',
        data:
          registerCount && registerCount.length > 0 ? registerCount.map((item) => Object.values(item)[0] || 0) : [0],
      },
      {
        name: '오늘 방문자 수',
        data: visitedCount && visitedCount.length > 0 ? visitedCount.map((item) => Object.values(item)[0] || 0) : [0],
      },
    ],
    [memberCount, registerCount, visitedCount]
  );

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
          {(latestCount ?? 0).toLocaleString()}명
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {selectedPeriod === 'date' ? '지난일에' : selectedPeriod === 'week' ? '지난주에' : '지난달에'}{' '}
          <strong>{Math.abs(increase ?? 0).toLocaleString()}명</strong> {increase >= 0 ? '증가했어요.' : '감소했어요.'}
          <Typography
            component="span"
            color={increase >= 0 ? 'success.main' : 'error'}
            sx={{ ml: 1, fontWeight: 'bold' }}
          >
            {(increasePercentage ?? 0).toFixed(2)}%{' '}
            {increase >= 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
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
        {memberCountLoading || visitedCountLoading || registerLoading ? (
          <Typography variant="body2" color="textSecondary">
            데이터를 불러오는 중입니다...
          </Typography>
        ) : memberCountError || visitedCountError || registerError ? (
          <Typography variant="body2" color="error">
            데이터를 불러오는 중 오류가 발생했습니다.
          </Typography>
        ) : (
          <Chart options={chartOptions} series={chartSeries} type="line" height={350} width="100%" />
        )}
      </CardContent>
    </Card>
  );
}
