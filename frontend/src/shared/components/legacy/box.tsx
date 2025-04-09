import {useMemo} from 'react';
import {cn} from '~/shared/utils';

type BoxProps = {
  width?: number;
  height: number;
  className?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  paddingX?: string;
  paddingY?: string;
  fullWidth?: boolean;
  flex?: boolean;
};

/**
 * Card Base
 * @param width width in rem
 * @param height height in rem
 * @param backgroundColor backgroundColor
 */
export default function Box({
  width,
  height,
  fullWidth,
  children,
  backgroundColor = '#ffffff',
  paddingX,
  paddingY,
  flex,
  className,
}: BoxProps) {
  const classes = useMemo(() => {
    let base = 'shadow-2xl rounded-2xl';
    if (paddingX) {
      base += ' px-4';
    }

    if (paddingY) {
      base += ' py-6';
    }

    if (flex) {
      base += 'flex flex-col';
    }

    return cn(base, className);
  }, [paddingX, paddingY, flex]);

  const style = useMemo(() => {
    if (fullWidth) {
      return {
        width: '100%',
        height: `${height}rem`,
        backgroundColor,
      };
    }

    if (width) {
      return {
        width: `${width}rem`,
        height: `${height}rem`,
        backgroundColor,
      };
    }

    return {
      width: `0rem`,
      height: `${height}rem`,
      backgroundColor,
    };
  }, [backgroundColor, fullWidth, height, width]);

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
