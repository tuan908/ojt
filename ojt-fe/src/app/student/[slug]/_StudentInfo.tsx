import {OjtUserRole} from "@/constants";
import {type OjtJwtPayload} from "@/auth";
import {type StudentsResponse} from "@/types/student.types";

type StudentInfoProps = {info?: StudentsResponse; auth?: OjtJwtPayload};

export default async function StudentInfo(props: StudentInfoProps) {
    if (props.auth === undefined || props?.auth?.role === OjtUserRole.Student) {
        return null;
    }

    return (
        <div className="border-b px-8 py-4 flex gap-y-2 flex-col md:flex-row lg:gap-x-12">
            <span>{props?.info?.name} さん</span>
            <span>{props?.info?.code}</span>
            <span>{props?.info?.grade}</span>
        </div>
    );
}
