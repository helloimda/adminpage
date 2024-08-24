'use client';

import * as React from 'react';
import type { GeneralCommentSearchType } from '@/api/board/general';
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

import { useDeleteGeneralComment, useFetchGeneralCommentData } from '@/hooks/board/user-gener';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../../customer/confirm-dialog';
import { GeneralCommentFilters } from './generalcomment-fillters';
import { CommentContentModal } from './generalcomment-modal';

export interface GeneralCommentTableProps {
  sx?: SxProps;
}

export function GeneralCommentTable({ sx }: GeneralCommentTableProps): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<GeneralCommentSearchType>('content');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedToDelete, setSelectedToDelete] = React.useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<string>('');
  const [selectedMemId, setSelectedMemId] = React.useState<string>('');
  const [selectedRegdt, setSelectedRegdt] = React.useState<string>('');
  const [selectedCntGood, setSelectedCntGood] = React.useState<number>(0);
  const [selectedCntBad, setSelectedCntBad] = React.useState<number>(0);

  const { data, loading, setData } = useFetchGeneralCommentData(searchQuery, searchType, currentPage);

  const cmtIdxArray = React.useMemo(() => data?.data.map((row) => row.cmt_idx) || [], [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(cmtIdxArray);

  const { doDeleteComment, loading: deleteLoading } = useDeleteGeneralComment();

  const handleDeleteComments = (): void => {
    if (selected.size === 0) return;
    setSelectedToDelete(new Set(selected));
    setConfirmOpen(true);
  };

  const confirmDeleteComments = async (): Promise<void> => {
    for (const cmtIdx of Array.from(selectedToDelete)) {
      await doDeleteComment(Number(cmtIdx));
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((comment) => comment.cmt_idx !== cmtIdx),
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

  const handleContentClick = (content: string, memId: string, regdt: string, cntGood: number, cntBad: number): void => {
    setSelectedContent(content);
    setSelectedMemId(memId);
    setSelectedRegdt(regdt);
    setSelectedCntGood(cntGood);
    setSelectedCntBad(cntBad);
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (data?.data.length || 1);
  const selectedAll = (data?.data.length || 0) > 0 && selected?.size === data?.data.length;

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      <CardHeader
        title="댓글 관리"
        titleTypographyProps={{
          variant: 'h4',
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GeneralCommentFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDeleteComments}
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
              <TableCell>내용</TableCell>
              <TableCell>좋아요</TableCell>
              <TableCell>싫어요</TableCell>
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
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.data.map((row) => {
                  const isSelected = selected.has(row.cmt_idx);
                  const truncatedContent = row.content.length > 10 ? `${row.content.slice(0, 10)}...` : row.content;

                  return (
                    <TableRow
                      hover
                      key={row.cmt_idx}
                      selected={isSelected}
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
                          return;
                        }
                        handleContentClick(row.content, row.mem_id, row.regdt, row.cnt_good, row.cnt_bad); // 모달 열기
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selectOne(row.cmt_idx);
                            } else {
                              deselectOne(row.cmt_idx);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.cmt_idx}</TableCell>
                      <TableCell>
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar />
                          <Typography variant="subtitle2">{row.mem_id}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250, cursor: 'pointer' }}>{truncatedContent}</TableCell>
                      <TableCell>{row.cnt_good}</TableCell>
                      <TableCell>{row.cnt_bad}</TableCell>
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
        onConfirm={confirmDeleteComments}
        loading={deleteLoading}
        title="댓글 삭제 확인"
        description="선택한 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />

      <CommentContentModal
        open={modalOpen}
        content={selectedContent}
        memId={selectedMemId}
        regdt={selectedRegdt}
        cntGood={selectedCntGood}
        cntBad={selectedCntBad}
        onClose={handleCloseModal}
      />
    </Card>
  );
}
