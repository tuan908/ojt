import json from "@/i18n/jp.json";
import { convertRole } from "@/lib/utils";

export default async function UserInfo({
    fullName,
    role,
}: {
    fullName?: string;
    role?: string;
}) {
    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-normal text-[#abb7bc]">
                {json.common.hello} {fullName}
            </h1>
            <h1 className="text-[#c3cbcf]">{convertRole(role)}</h1>
        </div>
    );
}
