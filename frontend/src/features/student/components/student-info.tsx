import {UserRole} from '~/shared/constants';

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

  return (
    <div className="border-b flex flex-col md:flex-row px-8 py-4 gap-y-2 gap-x-0 lg:gap-x-12">
      <span>{name} さん</span>
      <span>{code}</span>
      <span>{grade}</span>
    </div>
  );
}
