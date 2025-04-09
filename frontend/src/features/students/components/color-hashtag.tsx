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

  return (
    <div className="flex items-center justify-center leading-none bg-white shadow-md rounded-xl px-2 py-3 gap-x-2">
      <span style={{color}} className="font-semibold">
        {children}
      </span>
      <button
        className="border-none outline-none flex items-center justify-center"
        onClick={handleClick}
        aria-label="Remove hashtag">
        <Clear size="1.25rem" />
      </button>
    </div>
  );
}
