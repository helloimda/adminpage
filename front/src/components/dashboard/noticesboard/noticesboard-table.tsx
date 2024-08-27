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

import { type NoticeSearchType } from '@/types/board/notices';
import { useDeleteNotice, useFetchNoticeData } from '@/hooks/board/use-notices';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../customer/confirm-dialog'; // ConfirmDialog 컴포넌트 임포트
import { NoticesBoardFilters } from './noticesboard-filters';

export function NoticesBoardTable(): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<NoticeSearchType>('subject');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0); // 페이지네이션의 기본 페이지를 0으로 설정
  const [confirmOpen, setConfirmOpen] = React.useState(false); // ConfirmDialog 상태 관리
  const rowsPerPage = 10;

  const router = useRouter();

  const { data, loading, setData } = useFetchNoticeData(searchQuery, searchType, currentPage);

  const boIdxArray = React.useMemo(() => (data?.data ? data.data.map((row) => row.bo_idx) : []), [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(boIdxArray);

  const { doDeleteNotice, loading: deleteLoading } = useDeleteNotice();

  const handleDeleteNotices = async (): Promise<void> => {
    if (selected.size === 0) return;

    const selectedIds = Array.from(selected);

    for (const boIdx of selectedIds) {
      await doDeleteNotice(boIdx);
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((post) => post.bo_idx !== boIdx),
        };
      });
    }
    deselectAll();
    setConfirmOpen(false); // 삭제 후 ConfirmDialog 닫기
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
        title="공지 사항"
        titleTypographyProps={{
          variant: 'h4', // 제목 크기를 'h4'로 설정하여 더 크게 표시
          fontWeight: 'bold', // 텍스트를 굵게 설정
          color: 'primary.main', // 주요 색상으로 설정
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <NoticesBoardFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Box>
          {/* 생성 버튼 추가 */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              router.push('/dashboard/noticesboard/create'); // 생성 페이지로 라우팅
            }}
          >
            생성
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={() => {
              setConfirmOpen(true);
            }} // 삭제 버튼 클릭 시 ConfirmDialog 오픈
            disabled={selected.size === 0 || deleteLoading}
          >
            {deleteLoading ? '삭제 중...' : '삭제'}
          </Button>
        </Box>
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
                      router.push(`/dashboard/noticesboard/${row.bo_idx}/detail`); // 라우팅 경로 수정
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
        onConfirm={handleDeleteNotices}
        loading={deleteLoading}
        title="공지사항 삭제 확인"
        description="선택한 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
