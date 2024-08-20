'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  searchQuery: string;
  searchType: 'id' | 'nickname';
  onSearchQueryChange: (query: string) => void;
  onSearchTypeChange: (type: 'id' | 'nickname') => void;
}

export function CustomersFilters({
  searchQuery,
  searchType,
  onSearchQueryChange,
  onSearchTypeChange,
}: CustomersFiltersProps): React.JSX.Element {
  const handleSearchTypeChange = (event: SelectChangeEvent<'id' | 'nickname'>) => {
    onSearchTypeChange(event.target.value as 'id' | 'nickname');
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>검색 유형</InputLabel>
          <Select value={searchType} onChange={handleSearchTypeChange} label="검색 유형">
            <MenuItem value="id">ID 검색</MenuItem>
            <MenuItem value="nickname">닉네임 검색</MenuItem>
          </Select>
        </FormControl>
        <OutlinedInput
          value={searchQuery}
          onChange={handleSearchQueryChange}
          fullWidth
          placeholder={`Search customer by ${searchType}`}
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
      </Stack>
    </Card>
  );
}
