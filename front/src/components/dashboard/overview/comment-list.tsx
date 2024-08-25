'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { GeneralCommentSearchType } from '@/api/board/general';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  type SxProps,
} from '@mui/material';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';

import { useDeleteGeneralComment, useFetchGeneralCommentData } from '@/hooks/board/user-gener';

import { ConfirmDialog } from '../customer/confirm-dialog';
import { GeneralCommentFilters } from '../generalboard/comments/generalcomment-fillters';
import { CommentContentModal } from '../generalboard/comments/generalcomment-modal';

export interface GeneralCommentSmallTableProps {
  sx?: SxProps;
}

export function GeneralCommentSmallTable({ sx }: GeneralCommentSmallTableProps): React.JSX.Element {
  const [searchType, setSearchType] = React.useState<GeneralCommentSearchType>('content');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage] = React.useState(0);
  const rowsPerPage = 3; // Show only the top 3 comments

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedToDelete, setSelectedToDelete] = React.useState<number | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<string>('');
  const [selectedMemId, setSelectedMemId] = React.useState<string>('');
  const [selectedRegdt, setSelectedRegdt] = React.useState<string>('');
  const [selectedCntGood, setSelectedCntGood] = React.useState<number>(0);
  const [selectedCntBad, setSelectedCntBad] = React.useState<number>(0);

  const { data, loading, setData } = useFetchGeneralCommentData(searchQuery, searchType, currentPage);
  const { doDeleteComment } = useDeleteGeneralComment();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCmtIdx, setMenuCmtIdx] = React.useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cmtIdx: number): void => {
    event.stopPropagation(); // 이벤트 버블링을 막아 모달이 열리지 않도록 합니다.
    setAnchorEl(event.currentTarget);
    setMenuCmtIdx(cmtIdx);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    setMenuCmtIdx(null);
  };

  const handleDeleteClick = (cmtIdx: number): void => {
    setSelectedToDelete(cmtIdx);
    setConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDeleteComments = async (): Promise<void> => {
    if (selectedToDelete !== null) {
      await doDeleteComment(selectedToDelete);
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          data: prevData.data.filter((comment) => comment.cmt_idx !== selectedToDelete),
        };
      });
      setSelectedToDelete(null);
      setConfirmOpen(false);
    }
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

  const handleViewAll = (): void => {
    router.push('/dashboard/generalboard');
  };

  return (
    <Card sx={{ ...sx, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader title="댓글 리스트" />
      <GeneralCommentFilters
        searchQuery={searchQuery}
        searchType={searchType}
        onSearchQueryChange={setSearchQuery}
        onSearchTypeChange={setSearchType}
      />
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {loading
            ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                <ListItem key={`skeleton-${index}`} divider>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={48} height={48} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton variant="text" width="60%" />}
                    secondary={<Skeleton variant="text" width="40%" />}
                  />
                  <IconButton edge="end">
                    <DotsThreeVerticalIcon weight="bold" />
                  </IconButton>
                </ListItem>
              ))
            : data?.data.slice(0, rowsPerPage).map((row) => (
                <ListItem
                  key={row.cmt_idx}
                  divider
                  onClick={() => {
                    handleContentClick(row.content, row.mem_id, row.regdt, row.cnt_good, row.cnt_bad);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={row.mem_id}
                    secondary={`작성일: ${dayjs(row.regdt).format('YYYY-MM-DD HH:mm')} | 좋아요: ${row.cnt_good} | 싫어요: ${row.cnt_bad}`}
                  />
                  <IconButton
                    edge="end"
                    onClick={(event) => {
                      handleMenuOpen(event, row.cmt_idx);
                    }}
                  >
                    <DotsThreeVerticalIcon weight="bold" />
                  </IconButton>
                </ListItem>
              ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleViewAll} variant="text">
          View all
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleDeleteClick(menuCmtIdx ?? 0)}>삭제</MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={confirmDeleteComments}
        loading={false}
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
