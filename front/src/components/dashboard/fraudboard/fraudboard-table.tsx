'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { type FraudSearchType } from '@/types/board/fraud';
import { useDeleteFraudBoard, useFetchFraudBoardData } from '@/hooks/board/use-fraud';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../customer/confirm-dialog'; // 경고 다이얼로그 컴포넌트 임포트
import { FraudBoardFilters } from './fraudboard-filters';

export function FraudBoardTable(): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<FraudSearchType>('goodname');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0); // 페이지네이션의 기본 페이지를 0으로 설정
  const [confirmOpen, setConfirmOpen] = React.useState(false); // 다이얼로그 열림 상태 관리
  const [selectedIdsToDelete, setSelectedIdsToDelete] = React.useState<number[]>([]); // 삭제할 항목을 저장

  const rowsPerPage = 10;

  const router = useRouter();

  const { data, loading, setData } = useFetchFraudBoardData(searchQuery, searchType, currentPage);

  const boIdxArray = React.useMemo(() => (data?.data ? data.data.map((row) => row.bof_idx) : []), [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(boIdxArray);

  const { doDeleteFraudBoard, loading: deleteLoading } = useDeleteFraudBoard();

  const handleDeleteFraudBoards = async (): Promise<void> => {
    setConfirmOpen(true);
    setSelectedIdsToDelete(Array.from(selected));
  };

  const confirmDelete = async (): Promise<void> => {
    for (const bofIdx of selectedIdsToDelete) {
      await doDeleteFraudBoard(bofIdx);
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((post) => post.bof_idx !== bofIdx),
        };
      });
    }
    deselectAll();
    setConfirmOpen(false); // 다이얼로그 닫기
  };

  const handlePageChange = (_event: unknown, newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (): void => {
    setCurrentPage(0);
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (data?.data?.length || 1);
  const selectedAll = (data?.data?.length || 0) > 0 && selected?.size === data?.data?.length;

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CardHeader
        title="사기 피해 게시글"
        titleTypographyProps={{
          variant: 'h4', // 제목 크기를 'h4'로 설정하여 더 크게 표시
          fontWeight: 'bold', // 텍스트를 굵게 설정
          color: 'primary.main', // 주요 색상으로 설정
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FraudBoardFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDeleteFraudBoards}
          disabled={selected.size === 0 || deleteLoading}
        >
          {deleteLoading ? '삭제 중...' : '삭제'}
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>거래물품명</TableCell>
              <TableCell>조회수</TableCell>
              <TableCell>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={24} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((row) => {
                const isSelected = selected.has(row.bof_idx);

                return (
                  <TableRow
                    hover
                    key={row.bof_idx}
                    selected={isSelected}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
                        return;
                      }
                      router.push(`/dashboard/fraudboard/${row.bof_idx}/detail`);
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.bof_idx);
                          } else {
                            deselectOne(row.bof_idx);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.bof_idx}</TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar />
                        <Typography variant="subtitle2">{row.mem_id}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{ maxWidth: 150, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    >
                      {row.gd_name}
                    </TableCell>
                    <TableCell>{row.cnt_view}</TableCell>
                    <TableCell>{dayjs(row.regdt).format('YYYY-MM-DD HH:mm')}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography align="center" variant="body2">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={(data?.pagination.totalPages ?? 0) * rowsPerPage}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="삭제 확인"
        description="선택한 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
