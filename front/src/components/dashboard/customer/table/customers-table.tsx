'use client';

import * as React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import 'dayjs/locale/ko';

import { Button, CardHeader, TableHead } from '@mui/material';

import { type User } from '@/types/customer';
import { useDeleteUser, useFetchIdUserList, useFetchNickUserList, useFetchUserList } from '@/hooks/use-customer';
import { useSelection } from '@/hooks/use-selection';

import { ConfirmDialog } from '../confirm-dialog';
import { CustomersFilters } from '../customers-filters';
import { BenCustomerModal } from '../modal/benuser-modal';
import { CustomerModal } from '../modal/customers-modal';

export function CustomersTable(): React.JSX.Element {
  const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
  const [_selectedBenUser, setSelectedBenUser] = React.useState<User | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false); // 삭제 확인 다이얼로그 상태
  const [currentPage, setCurrentPage] = React.useState(0);
  const { doDeleteUser, loading: deleteLoading } = useDeleteUser();

  const [usersState, setUsersState] = React.useState<User[]>([]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState<'id' | 'nickname'>('id');

  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const {
    users: idUsers,
    loading: idLoading,
    error: idError,
    totalPages: idTotalPages,
  } = useFetchIdUserList(
    searchType === 'id' && searchQuery !== '' ? encodeURIComponent(searchQuery) : '',
    currentPage + 1
  );

  const {
    users: nickUsers,
    loading: nickLoading,
    error: nickError,
    totalPages: nickTotalPages,
  } = useFetchNickUserList(
    searchType === 'nickname' && searchQuery !== '' ? encodeURIComponent(searchQuery) : '',
    currentPage + 1
  );

  const {
    users: defaultUsers,
    loading: usersLoading,
    error: userError,
    totalPages: defaultTotalPages,
  } = useFetchUserList(currentPage + 1);

  const loading = searchQuery ? (searchType === 'id' ? idLoading : nickLoading) : usersLoading;
  const error = searchQuery ? (searchType === 'id' ? idError : nickError) : userError;
  const totalPages = searchQuery ? (searchType === 'id' ? idTotalPages : nickTotalPages) : defaultTotalPages;

  const users = React.useMemo(() => {
    if (searchQuery) {
      return searchType === 'id' ? idUsers : nickUsers;
    }
    return defaultUsers;
  }, [idUsers, nickUsers, defaultUsers, searchQuery, searchType]);

  React.useEffect(() => {
    if (!loading && users) {
      setUsersState(users || []);
    }
  }, [users, loading]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(
    React.useMemo(() => (Array.isArray(usersState) ? usersState.map((user) => user.mem_idx) : []), [usersState])
  );

  const filteredUsers = React.useMemo(() => {
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

  const handleUserUpdate = (updatedUser: User): void => {
    setUsersState((prevUsers) => prevUsers.map((user) => (user.mem_id === updatedUser.mem_id ? updatedUser : user)));
  };

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (filteredUsers?.length || 1);
  const selectedAll = (filteredUsers?.length || 0) > 0 && selected?.size === filteredUsers?.length;

  const handleRowClick = (event: React.MouseEvent, customer: User): void => {
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    if (customer.stopdt) {
      setSelectedBenUser(customer);
    } else {
      setSelectedCustomer(customer);
    }
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
    setSelectedBenUser(null);
  };

  const handleDeleteUsers = (): void => {
    setConfirmOpen(true); // 다이얼로그 열기
  };

  const confirmDeleteUsers = async (): Promise<void> => {
    const selectedIds = Array.from(selected).map(Number);
    await Promise.all(
      selectedIds.map(async (memIdx) => {
        await doDeleteUser(memIdx);
      })
    );
    setUsersState((prevUsers) => prevUsers.filter((user) => !selectedIds.includes(user.mem_idx)));
    deselectAll();
    setConfirmOpen(false); // 다이얼로그 닫기
  };
  if (loading && !usersState.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CardHeader
        title="유저"
        titleTypographyProps={{
          variant: 'h4', // 제목 크기를 'h4'로 설정하여 더 크게 표시
          fontWeight: 'bold', // 텍스트를 굵게 설정
          color: 'primary.main', // 주요 색상으로 설정
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CustomersFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteUsers}
          disabled={selected?.size === 0 || deleteLoading}
          sx={{ ml: 2 }}
        >
          {deleteLoading ? <CircularProgress size={24} /> : '계정 삭제'}
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
              <TableCell>아이디</TableCell>
              <TableCell>닉네임</TableCell>
              <TableCell>휴대폰 번호</TableCell>
              <TableCell>정지 유무</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !usersState.length
              ? Array.from(new Array(10)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
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
                  </TableRow>
                ))
              : filteredUsers?.map((row) => {
                  const isSelected = selected?.has(row.mem_idx);

                  return (
                    <TableRow
                      hover
                      key={`customer-${row.mem_id}`}
                      selected={isSelected}
                      onClick={(event) => {
                        handleRowClick(event, row);
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
                      <TableCell>
                        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                          <Avatar src={row.mem_profile_url || ''} />
                          <Typography variant="subtitle2">{row.mem_id}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.mem_nick}</TableCell>
                      <TableCell>{row.mem_hp}</TableCell>
                      <TableCell align="left">
                        {row.stopdt !== null ? <CancelIcon color="error" /> : null}
                      </TableCell>{' '}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={totalPages * 10}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />

      {selectedCustomer !== null && (
        <CustomerModal
          user={selectedCustomer}
          open={modalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUserUpdate}
        />
      )}

      {_selectedBenUser !== null && (
        <BenCustomerModal
          benUser={_selectedBenUser}
          open={modalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUserUpdate}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        onConfirm={confirmDeleteUsers}
        loading={deleteLoading}
        title="계정 삭제 확인"
        description="선택한 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="삭제"
      />
    </Card>
  );
}
