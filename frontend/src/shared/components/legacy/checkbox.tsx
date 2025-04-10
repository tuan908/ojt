import {
  Checkbox as MuiCheckbox,
  type CheckboxProps as MuiCheckboxProps,
} from '@mui/material';
import {type ReactNode} from 'react';
import {cn} from '~/shared/utils'; // Assuming you have this utility

export type CheckboxProps = Omit<MuiCheckboxProps, 'onChange'> & {
  label: ReactNode;
  name: string;
  handleChange?: MuiCheckboxProps['onChange'];
  labelPlacement?: 'start' | 'end';
  className?: string;
  labelClassName?: string;
};

export function Checkbox({
  label,
  name,
  checked,
  handleChange,
  labelPlacement = 'end',
  className,
  labelClassName,
  disabled,
  ...restProps
}: CheckboxProps) {
  // Generate a unique ID based on name to connect label and input
  const id = `checkbox-${name}`;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {labelPlacement === 'start' && (
        <label
          htmlFor={id}
          className={cn(
            'cursor-pointer select-none',
            disabled && 'text-gray-400 cursor-not-allowed',
            labelClassName,
          )}>
          {label}
        </label>
      )}

      <MuiCheckbox
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        sx={{
          '& .MuiSvgIcon-root': {fontSize: 20},
          ...(restProps.sx || {}),
        }}
        className={cn('accent-icon-default', restProps.classes)}
        disableFocusRipple
        {...restProps}
      />

      {labelPlacement === 'end' && (
        <label
          htmlFor={id}
          className={cn(
            'cursor-pointer select-none',
            disabled && 'text-gray-400 cursor-not-allowed',
            labelClassName,
          )}>
          {label}
        </label>
      )}
    </div>
  );
}
