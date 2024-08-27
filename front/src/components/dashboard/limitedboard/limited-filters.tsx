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

import type { LimitedSalesSearchType } from '@/types/board/limited';

interface LimitedSalesFiltersProps {
  searchQuery: string;
  searchType: LimitedSalesSearchType;
  onSearchQueryChange: (query: string) => void;
  onSearchTypeChange: (type: LimitedSalesSearchType) => void;
}

export function LimitedSalesFilters({
  searchQuery,
  searchType,
  onSearchQueryChange,
  onSearchTypeChange,
}: LimitedSalesFiltersProps): React.JSX.Element {
  const handleSearchTypeChange = (event: SelectChangeEvent<LimitedSalesSearchType>): void => {
    onSearchTypeChange(event.target.value as LimitedSalesSearchType);
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchQueryChange(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>검색 유형</InputLabel>
          <Select value={searchType} onChange={handleSearchTypeChange} label="검색 유형">
            <MenuItem value="name">상품명 검색</MenuItem>
            <MenuItem value="member">닉네임 검색</MenuItem>
          </Select>
        </FormControl>
        <OutlinedInput
          value={searchQuery}
          onChange={handleSearchQueryChange}
          fullWidth
          placeholder={`Search limited sales by ${searchType === 'name' ? '상품명' : '닉네임'}`}
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
