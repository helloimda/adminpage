'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import type { MemberDateType } from '@/types/customer';
import { useMembersCountByType } from '@/hooks/use-customer';

export interface TotalCustomersProps {
  sx?: SxProps;
}

export function TotalCustomers({ sx }: TotalCustomersProps): React.JSX.Element {
  const [selectedPeriod] = React.useState<MemberDateType>('month');

  const { memberCount } = useMembersCountByType(selectedPeriod);

  // 현재 달과 이전 달의 회원 수 계산
  const currentMonthCount = memberCount.length > 0 ? Object.values(memberCount[memberCount.length - 1])[0] : 0;
  const previousMonthCount = memberCount.length > 1 ? Object.values(memberCount[memberCount.length - 2])[0] : 0;

  // 회원 수의 증감 계산
  const difference = currentMonthCount - previousMonthCount;
  const percentageDiff = previousMonthCount ? Math.round((difference / previousMonthCount) * 100) : 0;

  // 증감 추세 계산
  const trend = difference > 0 ? 'up' : 'down';
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                전체 사용자 수
              </Typography>
              <Typography variant="h4">{String(currentMonthCount)}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: trendColor, height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {percentageDiff !== 0 && (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {percentageDiff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                지난 달 대비
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
