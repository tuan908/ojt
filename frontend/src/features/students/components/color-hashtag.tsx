import * as stylex from '@stylexjs/stylex';
import {CircleX as Clear} from 'lucide-react';
import {useCallback, type ReactNode} from 'react';

interface IColorHashtagProps {
  color: string;
  children: ReactNode;
  onRemove: (index: number) => void;
  index: number;
}

export default function ColorHashtag({
  color,
  onRemove,
  children,
  index,
}: IColorHashtagProps) {
  // ✅ Ensure `onRemove` is included in dependencies to avoid stale closure issues
  const handleClick = useCallback(() => onRemove(index), [onRemove, index]);

  const styles = stylex.create({
    span: color => ({color, fontWeight: 600}),
    button: {
      border: 'none',
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <div className="flex items-center justify-center leading-none bg-white shadow-md rounded-xl px-2 py-3 gap-x-2">
      <span {...stylex.props(styles.span(color))}>{children}</span>
      <button
        {...stylex.props(styles.button)}
        onClick={handleClick}
        aria-label="Remove hashtag">
        <Clear size="1.25rem" />
      </button>
    </div>
  );
}
