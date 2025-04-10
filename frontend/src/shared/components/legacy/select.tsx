'use client';

import {
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent as MuiSelectChangeEvent,
  type SelectProps as MuiSelectProps,
} from '@mui/material';
import {type ReactNode} from 'react';
import {menuProps, sx} from '~/shared/constants';
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
}

export default function LegacySelect({
  label,
  className,
  onChange,
  value,
  name,
  suppressContentEditableWarning = true,
  options = [],
  variant = 'standard',
}: ISelectProps) {
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
      MenuProps={menuProps}>
      <MenuItem value="" disabled>
        {label}
      </MenuItem>

      {options.map(option => (
        <MenuItem key={option.id} value={option.name}>
          {option.name}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}
