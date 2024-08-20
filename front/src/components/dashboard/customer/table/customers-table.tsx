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
import dayjs from 'dayjs';

import 'dayjs/locale/ko';

import { TableHead } from '@mui/material';

import { type User } from '@/types/customer';
import { createLogger } from '@/lib/logger';
import { useFetchIdUserList, useFetchNickUserList, useFetchUserList } from '@/hooks/use-customer';
import { useSelection } from '@/hooks/use-selection';

import { CustomersFilters } from '../customers-filters';
import { BenCustomerModal } from '../modal/benuser-modal'; // BenUserModal 가져오기
import { CustomerModal } from '../modal/customers-modal';

const logger = createLogger({ prefix: 'CustomersTable', level: 'DEBUG' });

dayjs.locale('ko');

export function CustomersTable(): React.JSX.Element {
  const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
  const [_selectedBenUser, setSelectedBenUser] = React.useState<User | null>(null); // BenUser와 CustomerModal을 구분하기 위한 상태
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);

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

  const previousUsers = React.useRef<User[] | null>(null);

  React.useEffect(() => {
    if (!loading && users) {
      previousUsers.current = users;
    }
  }, [users, loading]);

  React.useEffect(() => {
    logger.debug('Users:', users);
    logger.debug('UsersLoading:', loading);
    logger.debug('UserError:', error);
  }, [users, loading, error]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(
    React.useMemo(() => (Array.isArray(users) ? users.map((user) => user.mem_id) : []), [users])
  );

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      if (searchType === 'id') {
        return user.mem_id.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'nickname') {
        return user.mem_nick?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [users, searchQuery, searchType]);

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

  if (loading && !previousUsers.current) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CustomersFilters
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={setSearchType}
        />
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
              <TableCell>정지 유무 </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !previousUsers.current
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
                  const isSelected = selected?.has(row.mem_id);

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
                              selectOne(row.mem_id);
                            } else {
                              deselectOne(row.mem_id);
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
                      <TableCell align="left">{row.stopdt ? <CancelIcon color="error" /> : <></>}</TableCell>{' '}
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
        <CustomerModal user={selectedCustomer} open={modalOpen} onClose={handleCloseModal} />
      )}

      {_selectedBenUser !== null && (
        <BenCustomerModal benUser={_selectedBenUser} open={modalOpen} onClose={handleCloseModal} />
      )}
    </Card>
  );
}
