import * as stylex from '@stylexjs/stylex';
import {type ComponentProps} from 'react';

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
  const styles = stylex.create({
    span: (color, px) => ({color, padding: `0 ${px}rem`}),
  });

  return (
    <span {...stylex.props(styles.span(color, px))} {...otherProps}>
      {children}
    </span>
  );
}
