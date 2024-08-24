'use client';

import * as React from 'react';
import { useParams } from 'next/navigation'; // useParams를 사용하여 URL 파라미터 추출
import Stack from '@mui/material/Stack';

import NoticeDetailPage from '@/components/dashboard/noticesboard/noticesboard-detail';

export default function Page(): React.JSX.Element {
  const { id } = useParams(); // URL에서 ID를 추출

  // id가 아직 로딩 중일 때 로딩 중 상태 표시
  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={3}>
      <NoticeDetailPage
        params={{
          id: String(id),
        }}
      />
    </Stack>
  );
}
