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
  type SxProps,
} from '@mui/material';
import dayjs from 'dayjs';

import type { GeneralBoardSearchType } from '@/types/board/general';
import { useDeleteGeneralBoard, useFetchBoardData } from '@/hooks/board/user-gener';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../customer/confirm-dialog';
import { GeneralBoardFilters } from './generalboard-filters';

export interface GeneralBoardTableProps {
  sx?: SxProps;
}

export function GeneralBoardTable({ sx }: GeneralBoardTableProps): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<GeneralBoardSearchType>('subject');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedToDelete, setSelectedToDelete] = React.useState<Set<number>>(new Set());

  const router = useRouter();

  const { data, loading, setData } = useFetchBoardData(searchQuery, searchType, currentPage);

  const boIdxArray = React.useMemo(() => data?.data.map((row) => row.bo_idx) || [], [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(boIdxArray);

  const { doDeleteBoard, loading: deleteLoading } = useDeleteGeneralBoard();

  const handleDeleteBoards = (): void => {
    if (selected.size === 0) return;
    setSelectedToDelete(new Set(selected));
    setConfirmOpen(true);
  };

  const confirmDeleteBoards = async (): Promise<void> => {
    for (const boIdx of Array.from(selectedToDelete)) {
      await doDeleteBoard(Number(boIdx));
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((post) => post.bo_idx !== boIdx),
        };
      });
    }
    deselectAll();
    setConfirmOpen(false);
  };

  const handlePageChange = (_event: unknown, newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (): void => {
    setCurrentPage(0);
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (data?.data.length || 1);
  const selectedAll = (data?.data.length || 0) > 0 && selected?.size === data?.data.length;

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      <CardHeader
        title="게시글"
        titleTypographyProps={{
          variant: 'h4', // 제목 크기를 'h4'로 설정하여 더 크게 표시
          fontWeight: 'bold', // 텍스트를 굵게 설정
          color: 'primary.main', // 주요 색상으로 설정
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GeneralBoardFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDeleteBoards}
          disabled={selected.size === 0 || deleteLoading}
        >
          {deleteLoading ? '삭제 중...' : '삭제'}
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
              <TableCell>제목</TableCell>
              <TableCell>조회수</TableCell>
              <TableCell>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(rowsPerPage)).map((_, index) => (
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
              : data?.data.map((row) => {
                  const isSelected = selected.has(row.bo_idx);

                  return (
                    <TableRow
                      hover
                      key={row.bo_idx}
                      selected={isSelected}
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
                          return;
                        }
                        router.push(`/dashboard/generalboard/${row.bo_idx}`);
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selectOne(row.bo_idx);
                            } else {
                              deselectOne(row.bo_idx);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.bo_idx}</TableCell>
                      <TableCell>
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar />
                          <Typography variant="subtitle2">{row.mem_id}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ maxWidth: 150, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                      >
                        {row.subject}
                      </TableCell>
                      <TableCell>{row.cnt_view}</TableCell>
                      <TableCell>{dayjs(row.regdt).format('YYYY-MM-DD HH:mm')}</TableCell>
                    </TableRow>
                  );
                })}
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
        onConfirm={confirmDeleteBoards}
        loading={deleteLoading}
        title="게시글 삭제 확인"
        description="선택한 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
