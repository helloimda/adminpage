'use client';

import * as React from 'react';
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
  type SxProps,
} from '@mui/material';
import dayjs from 'dayjs';

import { useGeneralCommentDetail } from '@/hooks/board/user-gener';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../../customer/confirm-dialog';
import { CommentContentModal } from './generalcomment-modal';

export interface GeneralCommentDetailProps {
  boIdx: number;
  sx?: SxProps;
}

export function GeneralCommentDetail({ boIdx, sx }: GeneralCommentDetailProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10;

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<string>('');
  const [selectedMemId, setSelectedMemId] = React.useState<string>('');
  const [selectedRegdt, setSelectedRegdt] = React.useState<string>('');
  const [selectedCntGood, setSelectedCntGood] = React.useState<number>(0);
  const [selectedCntBad, setSelectedCntBad] = React.useState<number>(0);

  const { data, loading } = useGeneralCommentDetail(boIdx, currentPage);

  const cmtIdxArray = React.useMemo(() => data?.data.map((row) => row.cmt_idx) || [], [data]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(cmtIdxArray);

  const confirmDeleteComments = async (): Promise<void> => {
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
    <Card sx={{ p: 2, flexGrow: 1, ...sx }}>
      <CardHeader
        title="댓글 리스트"
        titleTypographyProps={{
          variant: 'h4',
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
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
        title="댓글 삭제 확인"
        description="선택한 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
        loading={false}
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
