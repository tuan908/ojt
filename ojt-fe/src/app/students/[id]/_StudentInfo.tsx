import {UserRole} from "@/constants";
import type {JwtPayload} from "@/lib/auth";

type StudentInfoProps = {
    info?: {
        code?: string;
        name?: string;
        grade?: string;
    };
    auth?: JwtPayload;
};

export default async function StudentInfo(props: StudentInfoProps) {
    const {info, auth} = props;
    if (auth === undefined || auth?.role === UserRole.Student) {
        return null;
    }

    return (
        <div className="border-b px-8 py-4 flex gap-y-2 flex-col md:flex-row lg:gap-x-12">
            <span>{info?.name} さん</span>
            <span>{info?.code}</span>
            <span>{info?.grade}</span>
        </div>
    );
}
