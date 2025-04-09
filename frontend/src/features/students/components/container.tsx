import {useMemo, type ReactNode} from 'react';
import {cn} from '~/shared/utils';

interface IContainerProps {
  readonly children: ReactNode;
  readonly gapY?: boolean;
  className?: string;
}

export default function Container({
  children,
  className = 'bg-white w-11/12 lg:w-24/25 h-[76dvh] rounded-lg shadow-2xl flex flex-col m-auto',
  gapY = false,
}: IContainerProps) {
  const classes = useMemo(() => {
    if (gapY) {
      return cn(className, 'gap-y-4');
    }
    return cn(className);
  }, [className, gapY]);

  return <div className={classes}>{children}</div>;
}
