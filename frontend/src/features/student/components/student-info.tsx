import { UserRole } from "@/shared/constants";
import type { Session } from "@/shared/lib/session";

type StudentInfoProps = {
    info?: {
        code?: string;
        name?: string;
        grade?: string;
    };
    auth?: Session;
};

export default async function StudentInfo(props: StudentInfoProps) {
    if (!props.auth || props.auth?.role === UserRole.Student) {
        return null;
    }

    return (
        <div className="border-b px-8 py-4 flex gap-y-2 flex-col md:flex-row lg:gap-x-12">
            <span>{props.info?.name} さん</span>
            <span>{props.info?.code}</span>
            <span>{props.info?.grade}</span>
        </div>
    );
}
