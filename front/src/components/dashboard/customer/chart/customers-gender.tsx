'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import useFetchGenderAge from '@/hooks/use-customer';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function CustomersGenderAgeChart(): React.JSX.Element {
  const theme = useTheme();
  const { genderAgeData, loading, error } = useFetchGenderAge();
  const [chartData, setChartData] = React.useState<{ maleData: number[]; femaleData: number[]; categories: string[] }>({
    maleData: [],
    femaleData: [],
    categories: [],
  });

  React.useEffect(() => {
    if (genderAgeData) {
      const categories = genderAgeData.map((data) => data.age_group ?? 'Unknown');
      const maleData = genderAgeData.map((data) => data.male ?? 0);
      const femaleData = genderAgeData.map((data) => data.female ?? 0);
      setChartData({ maleData, femaleData, categories });
    }
  }, [genderAgeData]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories.map((category) => category ?? 'Unknown'),
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.primary,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };

  const chartSeries = [
    {
      name: '남성',
      data: chartData.maleData,
    },
    {
      name: '여성',
      data: chartData.femaleData,
    },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!genderAgeData || genderAgeData.length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">회원 성별 연령 차트</Typography>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} width="100%" />
      </CardContent>
    </Card>
  );
}
