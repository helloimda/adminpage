'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
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

import { useNotAnsweredQnaList } from '@/hooks/board/use-qna'; // useNotAnsweredQnaList 훅 가져오기
import { useSelection } from '@/hooks/use-selection';

export function NotAnsweredQnaTable(): React.JSX.Element {
  const [currentPage, setCurrentPage] = React.useState(0); // 페이지네이션의 기본 페이지를 0으로 설정
  const rowsPerPage = 10;

  const router = useRouter();

  const { data, loading } = useNotAnsweredQnaList(currentPage + 1); // 페이지는 1부터 시작하기 때문에 +1

  const qnaIdxArray = React.useMemo(() => (data?.data ? data.data.map((row) => row.meq_idx) : []), [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(qnaIdxArray);

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
        title="미답변 QNA 리스트"
        titleTypographyProps={{
          variant: 'h4', // 제목 크기를 'h4'로 설정하여 더 크게 표시
          fontWeight: 'bold', // 텍스트를 굵게 설정
          color: 'primary.main', // 주요 색상으로 설정
        }}
      />
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
                </TableRow>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((row) => {
                const isSelected = selected.has(row.meq_idx);

                return (
                  <TableRow
                    hover
                    key={row.meq_idx}
                    selected={isSelected}
                    onClick={() => {
                      router.push(`/dashboard/noticesboard/qna/${row.meq_idx}`);
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.meq_idx);
                          } else {
                            deselectOne(row.meq_idx);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.meq_idx}</TableCell>
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
                    <TableCell>{dayjs(row.regdt).format('YYYY-MM-DD HH:mm')}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
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
    </Card>
  );
}
