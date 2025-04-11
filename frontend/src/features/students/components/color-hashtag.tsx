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

  const spanStyle = useCallback(
    (color: string) => ({color, fontWeight: 600}),
    [color],
  );

  return (
    <div className="flex items-center justify-center leading-none bg-white shadow-md rounded-xl px-2 py-3 gap-x-2">
      <span style={spanStyle(color)}>{children}</span>
      <button
        className="flex justify-center items-center border-none outline-none"
        onClick={handleClick}
        aria-label="Remove hashtag">
        <Clear size="1.25rem" />
      </button>
    </div>
  );
}
