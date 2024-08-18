'use client';

import * as React from 'react';
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
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import 'dayjs/locale/ko';

import { type BenUser } from '@/types/customer';
import { createLogger } from '@/lib/logger';
import { useFetchBenList } from '@/hooks/use-customer';
import { useSelection } from '@/hooks/use-selection';

import { BenCustomerModal } from '../modal/benuser-modal';

const logger = createLogger({ prefix: 'CustomersBenTable', level: 'DEBUG' });

dayjs.locale('ko');

export function CustomersBenTable(): React.JSX.Element {
  const [_selectedCustomer, setSelectedCustomer] = React.useState<BenUser | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);

  const { benUsers, loading: benUsersLoading, error: benUserError, totalPages } = useFetchBenList(currentPage + 1);

  const previousBenUsers = React.useRef<BenUser[] | null>(null);

  React.useEffect(() => {
    if (!benUsersLoading && benUsers) {
      previousBenUsers.current = benUsers;
    }
  }, [benUsers, benUsersLoading]);

  React.useEffect(() => {
    logger.debug('benUsers:', benUsers);
    logger.debug('benUsersLoading:', benUsersLoading);
    logger.debug('benUserError:', benUserError);
  }, [benUsers, benUsersLoading, benUserError]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(
    React.useMemo(() => (Array.isArray(benUsers) ? benUsers.map((user) => user.mem_id) : []), [benUsers])
  );

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < (benUsers?.length || 1);
  const selectedAll = (benUsers?.length || 0) > 0 && selected?.size === benUsers?.length;

  const handleRowClick = (customer: BenUser): void => {
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

  if (benUsersLoading && !previousBenUsers.current) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (benUserError) {
    return <Typography>Error: {benUserError}</Typography>;
  }

  return (
    <Card>
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
              <TableCell>정지 사유</TableCell>
              <TableCell>정지 해제일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {benUsersLoading && !previousBenUsers.current
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
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              : (benUsers || previousBenUsers.current)?.map((row) => {
                  const isSelected = selected?.has(row.mem_id);

                  return (
                    <TableRow
                      hover
                      key={`customer-${row.mem_id}`}
                      selected={isSelected}
                      onClick={() => {
                        handleRowClick(row);
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
                      <TableCell>
                        {row.stop_info && row.stop_info.length > 10
                          ? `${row.stop_info.slice(0, 10)}...`
                          : row.stop_info || ''}
                      </TableCell>
                      <TableCell>{dayjs(row.stopdt).format('YYYY년 M월 D일')}</TableCell>
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

      <BenCustomerModal benUser={_selectedCustomer} open={modalOpen} onClose={handleCloseModal} />
    </Card>
  );
}
