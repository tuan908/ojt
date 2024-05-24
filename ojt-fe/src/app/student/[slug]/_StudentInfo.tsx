import {OjtUserRole} from "@/constants";
import {type OjtJwtPayload} from "@/lib/auth";
import {type StudentResponseDto} from "@/types/student.types";

type StudentInfoProps = {info?: StudentResponseDto; auth?: OjtJwtPayload};

export default async function StudentInfo(props: StudentInfoProps) {
    if (props.auth === undefined || props?.auth?.role === OjtUserRole.Student) {
        return null;
    }

    return (
        <div className="border-b px-8 py-4 flex gap-x-12">
            <span>{props?.info?.name} さん</span>
            <span>{props?.info?.code}</span>
            <span>{props?.info?.grade}</span>
        </div>
    );
}
