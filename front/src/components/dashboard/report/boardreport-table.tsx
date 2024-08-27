'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent, // SelectChangeEvent 타입 추가
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { useBoardReportCount, useBoardReportList } from '@/hooks/use-report';

export function BoardReportTable(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'normal' | 'byReportCount'>('normal');
  const rowsPerPage = 10;

  const { data: reportData, loading: listLoading, error: listError } = useBoardReportList(currentPage + 1);
  const { data: countData, loading: countLoading, error: countError } = useBoardReportCount();

  const handlePageChange = (_event: unknown, newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleViewModeChange = (event: SelectChangeEvent<'normal' | 'byReportCount'>): void => {
    setViewMode(event.target.value as 'normal' | 'byReportCount');
    setCurrentPage(0); // 뷰 모드를 변경할 때 페이지를 첫 페이지로 리셋
  };

  const totalCount =
    viewMode === 'byReportCount' ? countData?.length || 0 : (reportData?.pagination.totalPages ?? 0) * rowsPerPage || 0;

  const mergedData = useMemo(() => {
    if (!reportData || !countData) return [];

    if (viewMode === 'byReportCount') {
      return countData;
    }

    return reportData.data.map((report) => {
      const countItem = countData.find((item) => item.bo_idx === report.bo_idx);
      return {
        ...report,
        report_count: countItem?.report_count || 0,
        total_report_count: countItem?.total_report_count || 0,
      };
    });
  }, [reportData, countData, viewMode]);

  return (
    <Card>
      <CardHeader title="게시글 신고 리스트" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="view-mode-label">보기 모드</InputLabel>
          <Select labelId="view-mode-label" value={viewMode} onChange={handleViewModeChange} label="보기 모드">
            <MenuItem value="normal">일반 리스트</MenuItem>
            <MenuItem value="byReportCount">신고 많은 순</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>신고 내용</TableCell>
              <TableCell>신고 횟수</TableCell>
              <TableCell>총 신고 수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listLoading || countLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography align="center">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : listError || countError ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography align="center" color="error">
                    {listError || countError}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : mergedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography align="center">No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              mergedData.map((report) => (
                <TableRow key={report.bo_idx}>
                  <TableCell>{report.bo_idx}</TableCell>
                  <TableCell>{report.content}</TableCell>
                  <TableCell>{report.report_count}</TableCell>
                  <TableCell>{report.total_report_count}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={totalCount}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
}
