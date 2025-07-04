'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import 'dayjs/locale/ko';

import WarningIcon from '@mui/icons-material/Warning';
import { Alert, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { type BenUser } from '@/types/customer';
import { useDoUnBen, useFetchBenList, useFetchIdBenUserList, useFetchNickBenUserList } from '@/hooks/use-customer';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../confirm-dialog';
import { CustomersFilters } from '../customers-filters';
import { BenCustomerModal } from '../modal/benuser-modal';

dayjs.locale('ko');

export function CustomersBenTable(): React.JSX.Element {
  const [_selectedCustomer, setSelectedCustomer] = React.useState<BenUser | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState<'id' | 'nickname'>('id');
  const [usersState, setUsersState] = React.useState<BenUser[]>([]);

  const defaultFetch = useFetchBenList(currentPage + 1);
  const idFetch = useFetchIdBenUserList(searchQuery, currentPage + 1);
  const nickFetch = useFetchNickBenUserList(searchQuery, currentPage + 1);

  const { benUsers, loading, totalPages } = React.useMemo(() => {
    if (searchQuery) {
      if (searchType === 'id') {
        return idFetch;
      } else if (searchType === 'nickname') {
        return nickFetch;
      }
    }
    return defaultFetch;
  }, [searchQuery, searchType, defaultFetch, idFetch, nickFetch]);

  React.useEffect(() => {
    if (!loading && benUsers) {
      setUsersState(benUsers || []);
    }
  }, [benUsers, loading]);

  const previousBenUsers = React.useRef<BenUser[] | null>(null);

  React.useEffect(() => {
    if (!loading && benUsers) {
      previousBenUsers.current = benUsers;
    }
  }, [benUsers, loading]);

  const { doUnBen, error } = useDoUnBen();

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(
    React.useMemo(() => (Array.isArray(usersState) ? usersState.map((user) => user.mem_idx) : []), [usersState])
  );

  const filteredBenUsers = React.useMemo(() => {
    if (!usersState) return [];
    return usersState.filter((user) => {
      if (searchType === 'id') {
        return user.mem_id.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'nickname') {
        return user.mem_nick?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [usersState, searchQuery, searchType]);

  const handleUserRemove = (removedUser: BenUser): void => {
    setUsersState((prevUsers) => prevUsers.filter((user) => user.mem_idx !== removedUser.mem_idx));
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (filteredBenUsers?.length || 1);
  const selectedAll = (filteredBenUsers?.length || 0) > 0 && selected?.size === filteredBenUsers?.length;

  const handleRowClick = (event: React.MouseEvent, customer: BenUser): void => {
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handlePageChange = (_event: unknown, newPage: number): void => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (): void => {
    setCurrentPage(0);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleBulkUnban = (): void => {
    if (selected.size === 0) return;
    setConfirmOpen(true); // 다이얼로그 열기
  };

  const confirmBulkUnban = async (): Promise<void> => {
    const selectedIds = Array.from(selected);
    await Promise.all(selectedIds.map((memIdx) => doUnBen(memIdx)));
    setConfirmOpen(false);
    deselectAll();
    setUsersState((prevUsers) => prevUsers.filter((user) => !selectedIds.includes(user.mem_idx)));
  };

  if (loading && !previousBenUsers.current) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center" sx={{ mt: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 3 }}>
      <CardHeader
        title="정지 유저"
        titleTypographyProps={{
          variant: 'h4',
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <CustomersFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkUnban}
          disabled={selected?.size === 0}
          sx={{ ml: 2 }}
        >
          단체 정지 해제
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800, border: `1px solid ${grey[300]}`, borderRadius: 1 }}>
          <TableHead sx={{ backgroundColor: grey[200] }}>
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
              <TableCell align="left">아이디</TableCell>
              <TableCell align="left">닉네임</TableCell>
              <TableCell align="left">휴대폰 번호</TableCell>
              <TableCell align="left">정지 사유</TableCell>
              <TableCell align="left">정지 해제일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !previousBenUsers.current
              ? Array.from(new Array(10)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </TableCell>
                    <TableCell colSpan={5}>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredBenUsers?.map((row) => {
                  const isSelected = selected?.has(row.mem_idx);

                  return (
                    <TableRow
                      hover
                      key={`customer-${row.mem_id}`}
                      selected={isSelected}
                      onClick={(event) => {
                        handleRowClick(event, row);
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: grey[100],
                        },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              selectOne(row.mem_idx);
                            } else {
                              deselectOne(row.mem_idx);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar src={row.mem_profile_url || ''} alt={row.mem_id} />
                          <Typography variant="subtitle2">{row.mem_id}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.mem_nick}</TableCell>
                      <TableCell align="left">{row.mem_hp}</TableCell>
                      <TableCell align="left">
                        {row.stop_info && row.stop_info.length > 10
                          ? `${row.stop_info.slice(0, 10)}...`
                          : row.stop_info || ''}
                      </TableCell>
                      <TableCell align="left">{dayjs(row.stopdt).format('YYYY년 M월 D일')}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </Box>
      <Divider sx={{ my: 2 }} />
      <TablePagination
        component="div"
        count={totalPages * 10}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />

      {modalOpen && _selectedCustomer && (
        <BenCustomerModal
          benUser={_selectedCustomer}
          open={modalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUserRemove}
        />
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
          정말로 정지를 해제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              mt: 1,
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            선택된 사용자들의 정지를 해제하면 즉시 서비스 이용이 가능해집니다.
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            이 작업은 회원의 서비스 접근을 즉시 허용하게 됩니다.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ mt: 2 }}>
          <Button
            onClick={() => {
              setConfirmOpen(false);
            }}
            color="primary"
            sx={{
              fontWeight: 'bold',
              color: 'grey.600',
            }}
          >
            취소
          </Button>
          <Button
            onClick={confirmBulkUnban}
            color="error"
            sx={{
              fontWeight: 'bold',
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '해제'}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={confirmBulkUnban}
        loading={loading}
        title="정지 해제 확인"
        description="선택된 사용자들의 정지를 해제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="해제"
      />
    </Card>
  );
}
