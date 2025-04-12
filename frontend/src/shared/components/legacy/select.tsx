'use client';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  InputAdornment,
  MenuItem,
  Select as MuiSelect,
  TextField,
  type SelectChangeEvent as MuiSelectChangeEvent,
  type SelectProps as MuiSelectProps,
} from '@mui/material';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import {menuProps, sx} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {cn} from '~/shared/utils';

export type MuiSelectChangeHandler = (
  event: MuiSelectChangeEvent<string>,
  reactNode: ReactNode,
) => void;

export interface ISelectOption {
  id: number;
  name: string;
}

interface ISelectProps {
  variant?: MuiSelectProps['variant'];
  className?: MuiSelectProps['className'];
  suppressContentEditableWarning?: MuiSelectProps['suppressContentEditableWarning'];
  name: MuiSelectProps['name'];
  value: MuiSelectProps<string>['value'];
  onChange: MuiSelectChangeHandler;
  label: string;
  options: ISelectOption[];
  searchable?: boolean;
}

export default function SearchableSelect({
  label,
  className,
  onChange,
  value,
  name,
  suppressContentEditableWarning = true,
  options = [],
  variant = 'standard',
  searchable = true,
}: ISelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  // Filter options whenever search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Focus the search input when the menu opens
  const handleOpen = () => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 10);
  };

  // Clear search when menu closes
  const handleClose = () => {
    setSearchTerm('');
  };

  // Custom render for the Menu
  const renderMenu = useMemo(() => {
    if (!searchable) return menuProps;
    return {
      PaperProps: {
        ...menuProps.slotProps?.paper,
        style: {
          ...menuProps.PaperProps?.style,
          maxHeight: 300,
        },
      },
      MenuListProps: {
        ...menuProps.MenuListProps,
        style: {
          padding: 0,
        },
      },
    };
  }, [searchable]);

  return (
    <MuiSelect
      className={cn('w-48', className)}
      displayEmpty
      onChange={onChange}
      label={label}
      name={name}
      suppressContentEditableWarning={suppressContentEditableWarning}
      sx={sx}
      variant={variant}
      value={value}
      MenuProps={renderMenu}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={selected => {
        if (!selected) {
          return <span>{label}</span>;
        }
        return <span>{selected}</span>;
      }}>
      {searchable && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 1,
            p: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder="検索..."
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={e => e.stopPropagation()}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}

      <MenuItem value="" disabled>
        {label}
      </MenuItem>

      {filteredOptions.length > 0 ? (
        filteredOptions.map(option => (
          <MenuItem key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>{json.common.noOptions}</MenuItem>
      )}
    </MuiSelect>
  );
}
