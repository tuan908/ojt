import {useCallback, type ComponentProps} from 'react';

type TextHashtagProps = ComponentProps<'span'> & {
  color: string;
  /** Padding X (in rem) */
  px?: number;
};

export default function TextHashtag({
  color,
  children,
  px = 0, // ✅ Set default to avoid undefined
  ...otherProps
}: TextHashtagProps) {
  const spanStyle = useCallback(
    (color: string, px: number) => ({color, padding: `0 ${px}rem`}),
    [color, px],
  );

  return (
    <span style={spanStyle(color, px)} {...otherProps}>
      {children}
    </span>
  );
}
