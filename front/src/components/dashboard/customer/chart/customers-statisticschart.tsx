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

  const latestCount = memberCount.length > 0 ? Object.values(memberCount[memberCount.length - 1])[0] : 0;
  const previousCount = memberCount.length > 1 ? Object.values(memberCount[memberCount.length - 2])[0] : 0;
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
    colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main], // 각각의 시리즈에 색상 지정
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

  const chartSeries = [
    {
      name: '회원수',
      data: memberCount.map((item) => Object.values(item)[0]), // 회원 수 데이터
    },
    {
      name: '오늘 가입한 회원수',
      data: registerCount.map((item) => Object.values(item)[0]), // 가입자 수 데이터
    },
    {
      name: '오늘 방문자 수',
      data: visitedCount.map((item) => Object.values(item)[0]), // 방문자 수 데이터
    },
  ];

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
          {latestCount.toLocaleString()}명
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {selectedPeriod === 'date' ? '지난일에' : selectedPeriod === 'week' ? '지난주에' : '지난달에'}{' '}
          <strong>{Math.abs(increase).toLocaleString()}명</strong> {increase >= 0 ? '증가했어요.' : '감소했어요.'}
          <Typography
            component="span"
            color={increase >= 0 ? 'success.main' : 'error'}
            sx={{ ml: 1, fontWeight: 'bold' }}
          >
            {increasePercentage.toFixed(2)}%{' '}
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
            {memberCountError || visitedCountError || registerError}
          </Typography>
        ) : (
          <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
        )}
      </CardContent>
    </Card>
  );
}
