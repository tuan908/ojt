import * as stylex from '@stylexjs/stylex';
import {UserRole} from '~/shared/constants';
import {MediaQueries} from '~/shared/styles/globalTokens.stylex';

type StudentInfoProps = {
  code?: string;
  name?: string;
  grade?: string;
  role?: string;
};

export default function StudentInfo({
  code,
  name,
  grade,
  role,
}: StudentInfoProps) {
  if (role === UserRole.Student) {
    return null;
  }

  const styles = stylex.create({
    div: {
      borderBottom: '1px solid',
      display: 'flex',
      flexDirection: {
        default: 'column',
        [MediaQueries.MD]: 'row',
      },
      padding: '1rem 2rem',
      rowGap: '0.5rem',
      columnGap: {
        default: null,
        [MediaQueries.LG]: '3rem',
      },
    },
  });

  return (
    <div {...stylex.props(styles.div)}>
      <span>{name} さん</span>
      <span>{code}</span>
      <span>{grade}</span>
    </div>
  );
}
