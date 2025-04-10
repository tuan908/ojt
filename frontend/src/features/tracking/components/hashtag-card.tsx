import * as stylex from '@stylexjs/stylex';
import Box from '~/shared/components/legacy/box';
import {MediaQueries} from '~/shared/styles/globalTokens.stylex';
import {IHashtagDto} from '~/shared/types';

export default function HashtagCard({hashtags}: {hashtags: IHashtagDto[]}) {
  const styles = stylex.create({
    ul: {
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      padding: {
        default: '0 2rem',
        [MediaQueries.XL]: '0 2.5rem',
      },
      rowGap: '1rem',
      placeContent: 'center',
      placeItems: 'center',
    },
    li: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'left',
      columnGap: '1rem',
    },
    dot: color => ({
      width: '0.75rem',
      height: '0.75rem',
      backgroundColor: color,
      borderRadius: `${Infinity}px`,
    }),
    title: color => ({
      color,
    }),
  });

  return (
    <Box width={48} height={20}>
      <ul {...stylex.props(styles.ul)}>
        {hashtags.map(label => (
          <li {...stylex.props(styles.li)} key={label.id}>
            <span {...stylex.props(styles.dot(label.color))} />
            <span {...stylex.props(styles.title(label.color))}>
              {label.name}
            </span>
          </li>
        ))}
      </ul>
    </Box>
  );
}
