'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Card,
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

import type { GeneralBoardSearchType } from '@/types/board/general';
import { useDeleteGeneralBoard, useFetchBoardData } from '@/hooks/board/user-gener';
import { useSelection } from '@/hooks/use-selection';

import { GeneralBoardFilters } from './generalboard-filters';

export function GeneralBoardTable(): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<GeneralBoardSearchType>('subject');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  const router = useRouter();

  // 게시글 목록을 가져오는 훅
  const { data, loading, setData } = useFetchBoardData(searchQuery, searchType, currentPage);

  // 선택된 게시글 관리 훅
  const boIdxArray = React.useMemo(() => data?.data.map((row) => row.bo_idx) || [], [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(boIdxArray);

  const { doDeleteBoard, loading: deleteLoading } = useDeleteGeneralBoard();

  const handleDeleteBoards = async (): Promise<void> => {
    if (selected.size === 0) return;

    const selectedIds = Array.from(selected);

    for (const boIdx of selectedIds) {
      await doDeleteBoard(boIdx);
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((post) => post.bo_idx !== boIdx),
        };
      });
    }
    deselectAll();
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
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          disabled={selected.size === 0 || deleteLoading} // 삭제 중이거나 선택된 항목이 없으면 비활성화
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
    </Card>
  );
}
