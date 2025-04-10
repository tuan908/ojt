import {forwardRef, type ComponentProps} from 'react';
import {cn} from '~/shared/utils';

type ResizeOptions = 'none' | 'vertical' | 'horizontal' | 'both';

type TextareaProps = Omit<ComponentProps<'textarea'>, 'className'> & {
  fullWidth?: boolean;
  resize?: ResizeOptions;
  error?: boolean;
  className?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      fullWidth = false,
      resize = 'vertical',
      error = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[80px] rounded-md border px-4 py-2 outline-none transition-colors',
          'placeholder:text-gray-400',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70',
          {
            'w-full': fullWidth,
            'resize-none': resize === 'none',
            'resize-y': resize === 'vertical',
            'resize-x': resize === 'horizontal',
            resize: resize === 'both',
            'border-red-500 focus:border-red-500 focus:ring-red-500': error,
            'border-gray-300': !error,
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
