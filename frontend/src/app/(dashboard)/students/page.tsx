import type {Metadata} from 'next';
import {getEvents, getGrades, getHashtags} from '~/app/actions/shared';
import Container from '~/features/students/components/container';
import StudentsDetail from '~/features/students/components/students-detail';
import {tryCatch} from '~/shared/utils';

export const metadata: Metadata = {
  title: '学生',
  description: '学生イベント',
};

export default async function Page() {
  const {data} = await tryCatch(
    Promise.all([getGrades(), getEvents(), getHashtags()]),
  );

  const [grades, events, hashtags] = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-full max-w-dvw min-h-dvh flex flex-col">
      <Container gapY>
        <StudentsDetail
          grades={grades ?? []}
          events={events ?? []}
          hashtags={hashtags ?? []}
        />
      </Container>
    </div>
  );
}
