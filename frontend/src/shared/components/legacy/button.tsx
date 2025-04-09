import {type ComponentProps} from 'react';
import {cn} from '~/shared/utils';

type ButtonProps = ComponentProps<'button'> & {
  color?: 'confirmed' | 'unconfirmed' | 'finished';
  classes?: string;
};

const colorClasses: Record<NonNullable<ButtonProps['color']>, string> = {
  unconfirmed: 'bg-blue-400',
  confirmed: 'bg-yellow-400',
  finished: 'bg-green-500',
};

export default function Button({
  color,
  children,
  classes,
  ...otherProps
}: ButtonProps) {
  return (
    <button
      {...otherProps}
      className={cn(
        'border-none outline-none px-4 py-2 rounded-md text-white font-medium',
        color ? colorClasses[color] : '',
        classes,
      )}>
      {children}
    </button>
  );
}
