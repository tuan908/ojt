import type {ComponentProps} from 'react';
import {cn} from '~/shared/utils';

type TextareaProps = ComponentProps<'textarea'> & {fullWidth?: boolean};

export default function Textarea({
  name,
  placeholder,
  onChange,
  fullWidth,
  ...otherProps
}: TextareaProps) {
  return (
    <textarea
      {...otherProps}
      className={cn(
        'resize-none border rounded-md px-4 py-1 outline-blue-500 disabled:cursor-not-allowed',
        fullWidth && 'w-full',
      )}
      name={name}
      placeholder={placeholder}
      cols={30}
      onChange={onChange}
    />
  );
}
