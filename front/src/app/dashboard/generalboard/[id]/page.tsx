'use client';

import * as React from 'react';
import { Box, Container, Grid } from '@mui/material';

import { GeneralCommentDetail } from '@/components/dashboard/generalboard/comments/generalcomment-detail';
import GeneralBoardDetailPage from '@/components/dashboard/generalboard/generalboard-detail';

export default function Page(): React.JSX.Element {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <GeneralBoardDetailPage />
            <GeneralCommentDetail boIdx={0} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
